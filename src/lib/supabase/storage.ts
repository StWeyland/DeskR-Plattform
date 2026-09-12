import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

const BUCKET = "programm-medien";

/**
 * Lädt eine Datei in den öffentlichen "programm-medien"-Bucket hoch und gibt die
 * öffentliche URL zurück. RLS erlaubt Schreibzugriff auf diesen Bucket nur Admins
 * (public.is_admin()) — der übergebene Client muss also ein eingeloggter Admin-Client sein.
 */
export async function uploadMedienDatei(
  supabase: SupabaseClient<Database>,
  file: File,
  ordner: string,
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = file.name.includes(".") ? file.name.split(".").pop() : undefined;
  const path = `${ordner}/${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || undefined,
  });
  if (error) {
    console.error("Medien-Upload fehlgeschlagen:", error.message);
    return null;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
