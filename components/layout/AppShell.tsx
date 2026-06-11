"use client";

import { TimeBackground } from "./TimeBackground";
import { SideNav, BottomNav } from "./SideNav";
import { RightPanel } from "./RightPanel";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TimeBackground />

      {/* Centered max-width wrapper — prevents left-sag on ultra-wide screens */}
      <div className="relative z-10 min-h-screen min-h-dvh flex justify-center">
        <div className="w-full flex" style={{ maxWidth: 1680 }}>
          <SideNav />
          <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-8 pb-36 lg:pb-10">
            {children}
          </main>
          <RightPanel />
        </div>
      </div>

      <BottomNav />
    </>
  );
}
