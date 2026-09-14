import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
import { secrets } from "base44:runtime";

// Parses "YYYY-MM-DD_IssueXXX_Title.pdf" (also accepts "YYYY-MM-DD_XXX_Title.pdf")
function parseBulletinFileName(name) {
  const baseName = String(name || "").replace(/\.pdf$/i, "");
  const match = baseName.match(/^(\d{4}-\d{2}-\d{2})[_-]?(?:issue[_-]?(\d+)|(\d+))(?:[_-](.+))?$/i);
  if (!match) return null;
  const publishDate = match[1];
  const issueNumber = parseInt(match[2] || match[3], 10);
  if (!publishDate || isNaN(issueNumber)) return null;
  const title = match[4] ? match[4].trim() : `עלון מס' ${issueNumber}`;
  return { publishDate, issueNumber, title };
}

async function processChangedFiles(base44, files, folderId) {
  const created = [];
  for (const file of files) {
    if (!file || file.mimeType !== "application/pdf") continue;
    if (file.trashed) continue;
    if (!file.parents || !file.parents.includes(folderId)) continue;
    const parsed = parseBulletinFileName(file.name);
    if (!parsed) continue;
    // Skip if a bulletin with this issue number already exists
    const existing = await base44.asServiceRole.entities.Bulletin.filter({
      issue_number: parsed.issueNumber,
    });
    if (existing.length > 0) continue;
    const record = await base44.asServiceRole.entities.Bulletin.create({
      issue_number: parsed.issueNumber,
      publish_date: parsed.publishDate,
      title: parsed.title,
      pdf_url: `https://drive.google.com/file/d/${file.id}/preview`,
      download_url: `https://drive.google.com/uc?export=download&id=${file.id}`,
      drive_file_id: file.id,
    });
    created.push({ issue_number: parsed.issueNumber, title: parsed.title, id: record.id });
  }
  return created;
}

export default async function (req) {
  try {
    const body = await req.json();
    const base44 = createClientFromRequest(req);
    const data = body.data || {};

    // Google Drive webhooks signal with an empty body + provider meta
    const resourceState = data._provider_meta && data._provider_meta["x-goog-resource-state"];
    if (resourceState === "sync") return Response.json({ status: "sync_ack" });

    const folderId = secrets.get("DRIVE_BULLETINS_FOLDER_ID");
    if (!folderId) {
      return Response.json({ error: "DRIVE_BULLETINS_FOLDER_ID secret is not set" }, { status: 500 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection("googledrive");
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // Load sync state (page token persisted across invocations)
    const existing = await base44.asServiceRole.entities.SyncState.filter({ name: "drive_bulletins" });
    const syncRecord = existing.length > 0 ? existing[0] : null;

    const changedFiles = [];

    if (!syncRecord) {
      // First run: backfill — process every PDF currently in the folder
      let pageToken = null;
      do {
        const query = `'${folderId}' in parents and mimeType='application/pdf' and trashed=false`;
        const listUrl =
          `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}` +
          `&fields=files(id,name,mimeType,parents,modifiedTime),nextPageToken&pageSize=100` +
          (pageToken ? `&pageToken=${pageToken}` : "");
        const res = await fetch(listUrl, { headers: authHeader });
        if (!res.ok) {
          return Response.json({ error: "drive_list_failed", details: await res.text() }, { status: 502 });
        }
        const page = await res.json();
        changedFiles.push(...(page.files || []));
        pageToken = page.nextPageToken;
      } while (pageToken);

      const tokenRes = await fetch("https://www.googleapis.com/drive/v3/changes/startPageToken", {
        headers: authHeader,
      });
      const { startPageToken } = await tokenRes.json();

      const created = await processChangedFiles(base44, changedFiles, folderId);
      if (startPageToken) {
        await base44.asServiceRole.entities.SyncState.create({
          name: "drive_bulletins",
          page_token: startPageToken,
        });
      }
      return Response.json({ status: "initialized", scanned: changedFiles.length, created });
    }

    // Incremental sync: fetch all change pages since the last processed token
    const baseUrl =
      `https://www.googleapis.com/drive/v3/changes?pageSize=100` +
      `&fields=changes(file(id,name,mimeType,parents,modifiedTime,trashed),removed),newStartPageToken,nextPageToken`;
    let changesUrl = `${baseUrl}&pageToken=${syncRecord.page_token}`;
    let newPageToken = null;

    while (changesUrl) {
      const res = await fetch(changesUrl, { headers: authHeader });
      if (!res.ok) {
        return Response.json({ error: "drive_changes_failed", details: await res.text() }, { status: 502 });
      }
      const page = await res.json();
      for (const change of page.changes || []) {
        if (change.removed) continue;
        if (change.file) changedFiles.push(change.file);
      }
      if (page.newStartPageToken) newPageToken = page.newStartPageToken;
      changesUrl = page.nextPageToken ? `${baseUrl}&pageToken=${page.nextPageToken}` : null;
    }

    const created = await processChangedFiles(base44, changedFiles, folderId);

    if (newPageToken) {
      await base44.asServiceRole.entities.SyncState.update(syncRecord.id, {
        page_token: newPageToken,
      });
    }

    return Response.json({ status: "processed", changed: changedFiles.length, created });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}