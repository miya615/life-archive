"use client";

import { TimeBackground } from "./TimeBackground";
import { SideNav, BottomNav } from "./SideNav";
import { RightPanel } from "./RightPanel";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Dynamic background */}
      <TimeBackground />

      <div className="min-h-screen min-h-dvh flex relative z-10">
        {/* Left sidebar — desktop */}
        <SideNav />

        {/* Center content */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-8 pb-28 lg:pb-10 overflow-x-hidden">
          <div className="max-w-4xl mx-auto xl:mx-0">
            {children}
          </div>
        </main>

        {/* Right panel — large desktop */}
        <RightPanel />
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </>
  );
}
