"use client";

import { TimeBackground } from "./TimeBackground";
import { SideNav, BottomNav } from "./SideNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TimeBackground />
      {/*
        min-h-svh: stable on iOS (svh = small-viewport-height, doesn't jump with URL bar)
        Do NOT use h-screen or h-dvh — those create fixed-height containers that block scroll.
      */}
      <div className="relative z-10 flex" style={{ minHeight: "100svh" }}>
        <SideNav />
        {/*
          pb-44 (176px) on mobile generously covers:
            - BottomNav ~60px
            - iPhone safe-area-inset-bottom ~34px
            - Extra buffer ~82px
          lg:pb-16 overrides on desktop.
        */}
        <main className="flex-1 min-w-0 pb-44 lg:pb-16">
          <div
            style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px 0" }}
            className="sm:px-6 lg:px-10 lg:pt-10"
          >
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </>
  );
}
