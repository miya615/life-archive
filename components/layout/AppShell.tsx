"use client";

import { BottomNav, SideNav } from "./BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen min-h-dvh flex">
      {/* Desktop sidebar */}
      <SideNav />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pb-28 lg:pb-12 pt-2 lg:pt-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
