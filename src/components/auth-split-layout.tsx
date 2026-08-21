import Image from "next/image";
import type { ReactNode } from "react";

export function AuthSplitLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-2xl font-semibold tracking-tight">Desk R.</div>
          {children}
        </div>
      </div>
      <div className="relative hidden bg-surface lg:block">
        <Image
          src="/stefanie-weyland.png"
          alt="Stefanie Weyland"
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}
