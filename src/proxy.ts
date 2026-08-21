import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Alle Pfade außer:
     * - _next/static, _next/image (Next.js interne Assets)
     * - Dateien mit Endung (Bilder, favicon etc.) — verhindert die
     *   MRH-Stolperfalle, bei der statische Assets fälschlich umgeleitet wurden
     */
    "/((?!_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
