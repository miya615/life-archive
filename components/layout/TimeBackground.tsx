"use client";

import { useEffect } from "react";

type Period = "morning" | "noon" | "evening" | "night";

function getPeriod(h = new Date().getHours()): Period {
  if (h >= 5  && h < 10) return "morning";
  if (h >= 10 && h < 17) return "noon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

/* Accent colors only — background stays white */
const ACCENT_VARS: Record<Period, Record<string, string>> = {
  morning: {
    "--accent":      "#007AFF",
    "--accent-dark": "#0065e0",
    "--accent-glow": "rgba(0,122,255,0.18)",
  },
  noon: {
    "--accent":      "#F59E0B",
    "--accent-dark": "#D97706",
    "--accent-glow": "rgba(245,158,11,0.20)",
  },
  evening: {
    "--accent":      "#EC4899",
    "--accent-dark": "#DB2777",
    "--accent-glow": "rgba(236,72,153,0.20)",
  },
  night: {
    "--accent":      "#8B5CF6",
    "--accent-dark": "#7C3AED",
    "--accent-glow": "rgba(139,92,246,0.20)",
  },
};

export function TimeBackground() {
  useEffect(() => {
    const update = () => {
      const p = getPeriod();
      const root = document.documentElement;
      Object.entries(ACCENT_VARS[p]).forEach(([k, v]) => root.style.setProperty(k, v));
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return null;
}
