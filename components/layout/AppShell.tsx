"use client";

import { TimeBackground } from "./TimeBackground";
import { SideNav, BottomNav } from "./SideNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TimeBackground />
      <div className="relative z-10 min-h-screen min-h-dvh flex">
        <SideNav />
        <main className="flex-1 min-w-0 pb-36 lg:pb-16">
          <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px 0" }}
            className="sm:px-6 lg:px-10 lg:pt-10">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </>
  );
}
