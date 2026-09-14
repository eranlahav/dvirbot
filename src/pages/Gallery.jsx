import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Loading from "@/components/Loading";
import { formatDateHe } from "@/lib/formatDate";

export default function Gallery() {
  const [albums, setAlbums] = useState(null);
  const [openPhoto, setOpenPhoto] = useState(null);

  useEffect(() => {
    base44.entities.PhotoAlbum.list("-date", 50).then(setAlbums).catch(() => setAlbums([]));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="font-heading text-3xl font-bold">גלריה</h1>
      <p className="mt-2 text-muted-foreground">תמונות מהחיים בקיבוץ</p>

      {albums === null ? (
        <Loading />
      ) : albums.length === 0 ? (
        <p className="mt-10 text-center text-lg text-muted-foreground">אין אלבומים עדיין</p>
      ) : (
        <div className="mt-8 space-y-12">
          {albums.map((album) => (
            <section key={album.id} aria-labelledby={`album-${album.id}`}>
              <h2 id={`album-${album.id}`} className="font-heading text-xl font-bold">
                {album.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatDateHe(album.date)} · {album.photos?.length || 0} תמונות
              </p>
              {album.description && <p className="mt-2 text-base">{album.description}</p>}
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {(album.photos || []).map((photo, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setOpenPhoto(photo)}
                    className="overflow-hidden rounded-2xl ring-1 ring-border/50 transition-shadow hover:shadow-md"
                    aria-label={`${album.title} — תמונה ${i + 1}`}
                  >
                    <Image
                      src={photo}
                      alt=""
                      fittingType="fill"
                      className="aspect-square w-full transition-transform duration-300 hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <Dialog
        open={!!openPhoto}
        onOpenChange={(open) => {
          if (!open) setOpenPhoto(null);
        }}
      >
        <DialogContent className="max-w-4xl p-3">
          <DialogTitle className="sr-only">תצוגת תמונה</DialogTitle>
          {openPhoto && (
            <Image src={openPhoto} alt="" className="max-h-[80vh] w-full rounded-2xl" fittingType="fit" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
