import { format } from "date-fns";
import { he } from "date-fns/locale";

export function formatDateHe(dateStr, fmt = "d בMMMM yyyy") {
  if (!dateStr) return "";
  try {
    return format(new Date(dateStr), fmt, { locale: he });
  } catch {
    return dateStr;
  }
}