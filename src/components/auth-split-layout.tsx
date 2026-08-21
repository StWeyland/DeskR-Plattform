import Image from "next/image";
import type { ReactNode } from "react";

export function AuthSplitLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center bg-background px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-10 font-serif text-2xl tracking-tight text-burgundy">Desk R.</div>
          {children}
        </div>
      </div>
      <div className="relative hidden bg-burgundy-deep lg:block">
        <Image
          src="https://desk-revolution.de/wp-content/uploads/2026/08/LinkedIn_Profilbild.png"
          alt="Stefanie Weyland"
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}
