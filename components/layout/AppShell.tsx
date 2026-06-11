"use client";

import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen min-h-dvh">
      <main className="pb-24 max-w-lg mx-auto px-4">{children}</main>
      <BottomNav />
    </div>
  );
}
