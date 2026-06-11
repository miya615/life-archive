"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Period = "morning" | "noon" | "evening" | "night";

function getPeriod(h = new Date().getHours()): Period {
  if (h >= 5  && h < 10) return "morning";
  if (h >= 10 && h < 17) return "noon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

const THEMES: Record<Period, {
  bg: string;
  orbs: { color: string; style: React.CSSProperties }[];
  vars: Record<string, string>;
}> = {
  morning: {
    bg: "linear-gradient(150deg,#040d1c 0%,#081e36 40%,#0a2d44 70%,#071828 100%)",
    orbs: [
      { color: "rgba(56,189,248,0.22)",  style: { top: "-15%", left: "-8%",   width: "60vw", height: "60vw" } },
      { color: "rgba(99,210,255,0.13)",  style: { top: "35%",  right: "-12%", width: "50vw", height: "50vw" } },
      { color: "rgba(147,231,253,0.09)", style: { bottom: "-8%", left: "30%", width: "40vw", height: "40vw" } },
    ],
    vars: {
      "--accent": "#38bdf8", "--accent-dark": "#0ea5e9", "--accent-glow": "rgba(56,189,248,0.28)",
      "--glass-bg": "rgba(8,30,52,0.55)", "--glass-border": "rgba(56,189,248,0.16)",
      "--glass-strong-bg": "rgba(8,30,52,0.72)", "--sidebar-bg": "rgba(4,13,28,0.82)",
      "--text-primary": "#e2f5ff", "--text-secondary": "rgba(186,235,253,0.78)", "--text-muted": "rgba(186,235,253,0.40)",
    },
  },
  noon: {
    bg: "linear-gradient(150deg,#140c00 0%,#2a1800 40%,#3b2400 70%,#200f00 100%)",
    orbs: [
      { color: "rgba(251,191,36,0.20)",  style: { top: "-12%", right: "-6%",  width: "58vw", height: "58vw" } },
      { color: "rgba(249,115,22,0.14)",  style: { top: "38%",  left: "-10%",  width: "50vw", height: "50vw" } },
      { color: "rgba(253,224,71,0.09)",  style: { bottom: "-5%", right: "22%", width: "38vw", height: "38vw" } },
    ],
    vars: {
      "--accent": "#fbbf24", "--accent-dark": "#f59e0b", "--accent-glow": "rgba(251,191,36,0.32)",
      "--glass-bg": "rgba(36,18,0,0.55)", "--glass-border": "rgba(251,191,36,0.16)",
      "--glass-strong-bg": "rgba(36,18,0,0.72)", "--sidebar-bg": "rgba(14,8,0,0.82)",
      "--text-primary": "#fffaed", "--text-secondary": "rgba(253,230,138,0.80)", "--text-muted": "rgba(253,230,138,0.40)",
    },
  },
  evening: {
    bg: "linear-gradient(150deg,#150420 0%,#2a0818 40%,#3d1206 70%,#180828 100%)",
    orbs: [
      { color: "rgba(244,63,94,0.22)",   style: { top: "-10%", right: "-8%",  width: "55vw", height: "55vw" } },
      { color: "rgba(168,85,247,0.16)",  style: { top: "32%",  left: "-12%",  width: "48vw", height: "48vw" } },
      { color: "rgba(251,113,133,0.11)", style: { bottom: "-8%", right: "18%", width: "42vw", height: "42vw" } },
    ],
    vars: {
      "--accent": "#f472b6", "--accent-dark": "#ec4899", "--accent-glow": "rgba(244,114,182,0.32)",
      "--glass-bg": "rgba(40,5,25,0.55)", "--glass-border": "rgba(244,114,182,0.16)",
      "--glass-strong-bg": "rgba(40,5,25,0.72)", "--sidebar-bg": "rgba(14,2,18,0.82)",
      "--text-primary": "#ffe6f4", "--text-secondary": "rgba(251,207,232,0.80)", "--text-muted": "rgba(251,207,232,0.40)",
    },
  },
  night: {
    bg: "linear-gradient(150deg,#06020f 0%,#0d0520 40%,#050f28 70%,#0f0520 100%)",
    orbs: [
      { color: "rgba(139,92,246,0.20)",  style: { top: "-12%", left: "-8%",   width: "58vw", height: "58vw" } },
      { color: "rgba(99,102,241,0.15)",  style: { top: "38%",  right: "-12%", width: "50vw", height: "50vw" } },
      { color: "rgba(167,139,250,0.10)", style: { bottom: "-6%", left: "22%", width: "40vw", height: "40vw" } },
    ],
    vars: {
      "--accent": "#a78bfa", "--accent-dark": "#818cf8", "--accent-glow": "rgba(167,139,250,0.28)",
      "--glass-bg": "rgba(10,5,25,0.55)", "--glass-border": "rgba(167,139,250,0.15)",
      "--glass-strong-bg": "rgba(10,5,25,0.72)", "--sidebar-bg": "rgba(6,2,15,0.82)",
      "--text-primary": "#f0f2ff", "--text-secondary": "rgba(210,215,245,0.78)", "--text-muted": "rgba(180,185,225,0.42)",
    },
  },
};

/* Particles: only rendered on desktop, 0 on mobile for performance */
function Particles({ isMobile }: { isMobile: boolean }) {
  const count = isMobile ? 0 : 24;
  const items = useRef(
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.5,
      dur: Math.random() * 14 + 12,
      delay: Math.random() * -18,
      opacity: Math.random() * 0.35 + 0.10,
    }))
  );
  if (count === 0) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {items.current.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full bg-white"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
          animate={{ y: [0, -24, 0], opacity: [p.opacity, p.opacity * 1.8, p.opacity] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function TimeBackground() {
  const [period, setPeriod] = useState<Period>("night");
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    const update = () => {
      const p = getPeriod();
      setPeriod(p);
      const root = document.documentElement;
      Object.entries(THEMES[p].vars).forEach(([k, v]) => root.style.setProperty(k, v));
    };
    update();
    setMounted(true);
    const id = setInterval(update, 60_000);
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  if (!mounted) return null;
  const theme = THEMES[period];

  /* On mobile: show only 1 orb (the first, largest), no animation */
  const displayOrbs = isMobile ? theme.orbs.slice(0, 1) : theme.orbs;

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={period} className="fixed inset-0 z-[-2] pointer-events-none"
          style={{ background: theme.bg }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </AnimatePresence>

      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        {displayOrbs.map((orb, i) => (
          isMobile ? (
            /* Static orb on mobile — no animation for performance */
            <div
              key={`${period}-${i}`}
              className="absolute rounded-full blur-3xl"
              style={{
                background: `radial-gradient(circle, ${orb.color} 0%, transparent 68%)`,
                ...orb.style,
                opacity: 0.85,
              }}
            />
          ) : (
            <motion.div
              key={`${period}-${i}`}
              className="absolute rounded-full blur-3xl"
              style={{ background: `radial-gradient(circle, ${orb.color} 0%, transparent 68%)`, ...orb.style }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 10 + i * 3, delay: i * 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )
        ))}
      </div>

      <Particles isMobile={isMobile} />
    </>
  );
}
