"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, PenLine, Camera, Activity, Leaf } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Entry, CATEGORY_ICONS, CARD_STYLES } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import type { ReflectionData } from "@/lib/utils";
import { HomeReflections } from "./HomeReflections";
import { WeightCard } from "@/components/weight/WeightCard";
import { MemoCard } from "@/components/memo/MemoCard";
import { WeightModal } from "@/components/weight/WeightModal";

function todayFormatted() {
  return new Date().toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric", weekday: "long",
  });
}

function todayKey() {
  return new Date().toISOString().split("T")[0];
}

type Period = "morning" | "noon" | "evening" | "night";

interface TimeTheme {
  greeting: string;
  emoji: string;
  message: string;
  background: string;
  border: string;
  shadow: string;
  textColor: string;
  subTextColor: string;
  statBg: string;
  statColor: string;
  isNight: boolean;
}

const TIME_THEMES: Record<Period, TimeTheme> = {
  morning: {
    greeting: "おはようございます",
    emoji: "☀️",
    message: "今朝の気持ちや決意を、未来の自分への手紙として残しておきましょう。",
    background: "linear-gradient(135deg, #FFFBF0 0%, #FEF6E4 60%, #FFFAF2 100%)",
    border: "rgba(217, 180, 130, 0.28)",
    shadow: "0 8px 32px rgba(217, 150, 80, 0.12)",
    textColor: "#2C1A0E",
    subTextColor: "#8A6A4A",
    statBg: "rgba(217, 150, 80, 0.12)",
    statColor: "#7A5A30",
    isNight: false,
  },
  noon: {
    greeting: "こんにちは",
    emoji: "🌤",
    message: "今の気持ちや出来事を、数年後の自分が読み返せるように残しましょう。",
    background: "linear-gradient(135deg, #F8FCFF 0%, #EEF6FF 60%, #F5FAFF 100%)",
    border: "rgba(147, 197, 253, 0.30)",
    shadow: "0 8px 32px rgba(100, 160, 240, 0.10)",
    textColor: "#0F2040",
    subTextColor: "#4A6080",
    statBg: "rgba(100, 160, 240, 0.10)",
    statColor: "#3060A0",
    isNight: false,
  },
  evening: {
    greeting: "おつかれさまです",
    emoji: "🌇",
    message: "何気ない1日も、未来の自分には大切な記録です。今日を静かに残しましょう。",
    background: "linear-gradient(135deg, #FFF6F0 0%, #FEF0E4 60%, #FFF8F5 100%)",
    border: "rgba(253, 186, 116, 0.32)",
    shadow: "0 8px 32px rgba(234, 100, 50, 0.10)",
    textColor: "#2C1408",
    subTextColor: "#8A5030",
    statBg: "rgba(234, 100, 50, 0.10)",
    statColor: "#8A4020",
    isNight: false,
  },
  night: {
    greeting: "おかえり",
    emoji: "🌙",
    message: "一日の終わりに、今日の記憶を静かに残しましょう。眠る前のほんの数分で。",
    background: "linear-gradient(135deg, #1E1B3A 0%, #2D2860 50%, #1A1730 100%)",
    border: "rgba(139, 92, 246, 0.22)",
    shadow: "0 8px 32px rgba(100, 80, 200, 0.22)",
    textColor: "#EDE9FE",
    subTextColor: "#C4B5FD",
    statBg: "rgba(139, 92, 246, 0.15)",
    statColor: "#C4B5FD",
    isNight: true,
  },
};

function getTimeTheme(hour: number): TimeTheme {
  if (hour >= 5  && hour < 11) return TIME_THEMES.morning;
  if (hour >= 11 && hour < 16) return TIME_THEMES.noon;
  if (hour >= 16 && hour < 19) return TIME_THEMES.evening;
  return TIME_THEMES.night;
}

const MOODS = ["😊", "😌", "😤", "😢", "🤔", "🔥", "😴", "🥳"];
const MOOD_LS_KEY = "daily_mood_v1";

function loadMood(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = localStorage.getItem(MOOD_LS_KEY);
    if (!raw) return "";
    const parsed = JSON.parse(raw) as { mood: string; date: string };
    return parsed.date === todayKey() ? parsed.mood : "";
  } catch { return ""; }
}

function saveMood(mood: string) {
  try {
    localStorage.setItem(MOOD_LS_KEY, JSON.stringify({ mood, date: todayKey() }));
  } catch { /* noop */ }
}

interface HomeData {
  entries: Entry[];
  monthCount: number;
  todayCount: number;
  displayName: string;
  reflection: ReflectionData;
}

/* ── GreetingCard ── */
function GreetingCard({ theme, displayName, todayCount, monthCount }: {
  theme: TimeTheme;
  displayName: string;
  todayCount: number;
  monthCount: number;
}) {
  return (
    <div className="mx-4 mb-4">
      <div
        className="relative overflow-hidden"
        style={{
          padding: "clamp(22px, 5vw, 38px)",
          background: theme.background,
          borderRadius: 28,
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadow,
        }}
      >
        <p className="text-[11px] font-medium tracking-wide mb-3" style={{ color: theme.subTextColor }}>
          {todayFormatted()}
        </p>

        <h1
          className="font-bold leading-tight mb-2"
          style={{ fontSize: "clamp(20px, 5vw, 30px)", color: theme.textColor }}
        >
          {theme.greeting}
          {displayName ? `、${displayName}さん` : ""} {theme.emoji}
        </h1>

        <p className="text-[13px] leading-relaxed mb-5 max-w-sm" style={{ color: theme.subTextColor }}>
          {theme.message}
        </p>

        <div className="flex flex-wrap gap-2">
          <span
            className="text-[12px] font-semibold px-3 py-1.5 rounded-full"
            style={{ background: theme.statBg, color: theme.statColor }}
          >
            {todayCount === 0 ? "今日はまだ記録なし" : `今日 ${todayCount}件`}
          </span>
          <span
            className="text-[12px] font-semibold px-3 py-1.5 rounded-full"
            style={{ background: theme.statBg, color: theme.statColor }}
          >
            今月 {monthCount}件
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── MoodCard ── */
function MoodCard() {
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    setSelected(loadMood());
  }, []);

  function handleSelect(mood: string) {
    const next = selected === mood ? "" : mood;
    setSelected(next);
    if (next) {
      saveMood(next);
    } else {
      try { localStorage.removeItem(MOOD_LS_KEY); } catch { /* noop */ }
    }
  }

  return (
    <div
      className="mx-4 mb-4 px-4 py-4"
      style={{
        background: "#FFFCF7",
        borderRadius: 24,
        border: "1px solid rgba(210, 185, 155, 0.22)",
        boxShadow: "0 4px 20px rgba(180, 140, 80, 0.07)",
      }}
    >
      <p className="text-[12px] font-semibold mb-3" style={{ color: "#8A7060" }}>
        いまの気分は？
      </p>
      <div className="flex gap-2 flex-wrap">
        {MOODS.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => handleSelect(m)}
            className="transition-transform duration-100 active:scale-90"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              fontSize: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: selected === m ? "rgba(217, 150, 80, 0.15)" : "rgba(0,0,0,0.03)",
              border: selected === m ? "2px solid rgba(217, 150, 80, 0.50)" : "2px solid transparent",
              cursor: "pointer",
              touchAction: "manipulation",
            }}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── QuickActions ── */
function QuickActions() {
  const [weightOpen, setWeightOpen] = useState(false);

  const actions: Array<{
    icon: ReactNode;
    label: string;
    color: string;
    bg: string;
    iconBg: string;
    href?: string;
    onClick?: () => void;
  }> = [
    {
      icon: <PenLine style={{ width: 20, height: 20 }} strokeWidth={1.8} />,
      label: "メモを書く",
      color: "#D97706",
      bg: "rgba(217, 119, 6, 0.08)",
      iconBg: "rgba(217, 119, 6, 0.14)",
      onClick: () => {
        document.getElementById("cards-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      },
    },
    {
      icon: <Camera style={{ width: 20, height: 20 }} strokeWidth={1.8} />,
      label: "写真を残す",
      color: "#2563EB",
      bg: "rgba(37, 99, 235, 0.07)",
      iconBg: "rgba(37, 99, 235, 0.12)",
      href: "/entries/new",
    },
    {
      icon: <Activity style={{ width: 20, height: 20 }} strokeWidth={1.8} />,
      label: "体調を記録",
      color: "#059669",
      bg: "rgba(5, 150, 105, 0.07)",
      iconBg: "rgba(5, 150, 105, 0.12)",
      onClick: () => setWeightOpen(true),
    },
    {
      icon: <Leaf style={{ width: 20, height: 20 }} strokeWidth={1.8} />,
      label: "健康を記録",
      color: "#9333EA",
      bg: "rgba(147, 51, 234, 0.07)",
      iconBg: "rgba(147, 51, 234, 0.10)",
      href: "/entries/new",
    },
  ];

  return (
    <div className="mx-4 mb-5">
      <p className="text-[12px] font-semibold mb-3" style={{ color: "#8A7060" }}>クイック記録</p>
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((a) => {
          const inner = (
            <div
              className="flex flex-col gap-2.5 p-3.5 rounded-[18px] active:scale-[0.97] transition-transform duration-100"
              style={{
                background: a.bg,
                border: "1px solid rgba(0,0,0,0.05)",
                touchAction: "manipulation",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: a.iconBg, color: a.color }}
              >
                {a.icon}
              </div>
              <span className="text-[13px] font-semibold" style={{ color: "#2C1A0E" }}>{a.label}</span>
            </div>
          );

          if (a.href) {
            return (
              <Link key={a.label} href={a.href} style={{ display: "block" }}>
                {inner}
              </Link>
            );
          }
          return (
            <button key={a.label} type="button" onClick={a.onClick} className="text-left block w-full">
              {inner}
            </button>
          );
        })}
      </div>
      <WeightModal
        open={weightOpen}
        onClose={() => setWeightOpen(false)}
        onSaved={() => setWeightOpen(false)}
      />
    </div>
  );
}

/* ── HomeSkeleton ── */
function HomeSkeleton() {
  return (
    <div className="space-y-4 px-4 animate-pulse">
      <div className="h-5 w-32 rounded-full bg-stone-100" />
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-[20px] bg-stone-100" style={{ height: 160 }} />
        ))}
      </div>
    </div>
  );
}

/* ── HomeCards ── */
function HomeCards({ entries, reflection }: { entries: Entry[]; reflection: ReflectionData }) {
  return (
    <div className="space-y-5 px-4">
      <div id="cards-section" className="grid grid-cols-2 gap-3">
        <WeightCard />
        <MemoCard />
      </div>

      <div>
        <div className="mb-4 text-center">
          <h2 className="text-[17px] font-bold text-primary">最近の記録</h2>
          <p className="text-[11px] text-muted mt-0.5">あなたの思い出・気づき・出来事</p>
        </div>
        <div className="flex justify-end mb-3">
          <Link
            href="/entries"
            className="text-[12px] flex items-center gap-1 font-medium active:opacity-60 transition-opacity duration-100"
            style={{ color: "var(--accent)", touchAction: "manipulation" }}
          >
            すべて見る <ArrowRight style={{ width: 12, height: 12 }} />
          </Link>
        </div>

        {entries.length === 0 ? (
          <div className="glass p-14 text-center">
            <div className="w-14 h-14 rounded-3xl mx-auto mb-5 flex items-center justify-center"
              style={{ background: "var(--glass-strong-bg)" }}>
              <CalendarDays style={{ width: 24, height: 24, color: "var(--accent)" }} strokeWidth={1.5} />
            </div>
            <p className="text-[15px] text-secondary font-medium mb-1">まだ記録がありません</p>
            <p className="text-[13px] text-muted mb-6">最初の1ページを残してみましょう</p>
            <Link
              href="/entries/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold text-[14px] active:scale-[0.97] active:opacity-90 transition-transform duration-100"
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                boxShadow: "0 4px 20px var(--accent-glow)",
                touchAction: "manipulation",
              }}
            >
              ✏️ 最初の記録を書く
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 items-start">
            {entries.slice(0, 6).map((entry, i) => {
              const cs = CARD_STYLES[entry.category] ?? CARD_STYLES["日常"];
              const hasImage = Boolean(entry.image_url);
              return (
                <motion.div key={entry.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.10), duration: 0.14, ease: "easeOut" }}
                  className="overflow-hidden rounded-[20px] active:scale-[0.98] active:opacity-90 transition-transform duration-100 flex flex-col"
                  style={{
                    background: cs.bg,
                    border: `1px solid ${cs.borderColor}`,
                    boxShadow: "var(--card-shadow)",
                    touchAction: "manipulation",
                    height: 200,
                  }}
                >
                  <Link
                    href={`/entries/${entry.id}`}
                    className="flex flex-col h-full"
                    style={{ touchAction: "manipulation" }}
                  >
                    {hasImage ? (
                      <div className="w-full shrink-0 overflow-hidden" style={{ height: 112 }}>
                        <img
                          src={entry.image_url!}
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    ) : (
                      <div className="flex w-full shrink-0 items-center justify-center" style={{ height: 112, background: `${cs.accent}22` }}>
                        <span className="text-3xl" style={{ opacity: 0.7 }}>
                          {CATEGORY_ICONS[entry.category]}
                        </span>
                      </div>
                    )}
                    <div className="flex min-h-0 flex-1 flex-col justify-start gap-1 px-3.5 pt-2.5 pb-3 overflow-hidden">
                      <div className="flex min-w-0 items-center gap-1">
                        <span className="shrink-0 text-[13px] font-bold leading-tight" style={{ color: cs.labelColor }}>
                          {entry.category}
                        </span>
                        <span className="min-w-0 truncate text-[10px] leading-tight text-slate-400 ml-auto">
                          {formatDate(entry.entry_date)}
                        </span>
                      </div>
                      <p className="block min-w-0 overflow-hidden break-words text-[13px] font-bold leading-snug line-clamp-2" style={{ color: "#0F172A" }}>
                        {entry.title}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <HomeReflections data={reflection} />
    </div>
  );
}

/* ── HomeContent (main) ── */
export function HomeContent() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  // null = SSR / before hydration → avoids hydration mismatch
  const [theme, setTheme] = useState<TimeTheme | null>(null);

  useEffect(() => {
    setTheme(getTimeTheme(new Date().getHours()));
  }, []);

  // resolved theme (falls back to noon during SSR)
  const t = theme ?? TIME_THEMES.noon;

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !mounted) return;

        const now = new Date();
        const today = now.toISOString().split("T")[0];
        function pad(n: number) { return String(n).padStart(2, "0"); }
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
        const mm = pad(now.getMonth() + 1);
        const dd = pad(now.getDate());
        const thisYear = now.getFullYear();

        const [
          { data: recentEntries },
          { count: monthCount },
          { count: todayCount },
          { data: profile },
          { data: oneYearAgo },
        ] = await Promise.all([
          supabase.from("entries").select("*").eq("user_id", user.id).order("entry_date", { ascending: false }).limit(8),
          supabase.from("entries").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("entry_date", startOfMonth),
          supabase.from("entries").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("entry_date", today),
          supabase.from("profiles").select("display_name").eq("id", user.id).single(),
          supabase.from("entries").select("*").eq("user_id", user.id).like("entry_date", `%-${mm}-${dd}`).neq("entry_date", `${thisYear}-${mm}-${dd}`).order("entry_date", { ascending: false }).limit(2),
        ]);

        if (!mounted) return;

        setData({
          entries: recentEntries ?? [],
          monthCount: monthCount ?? 0,
          todayCount: todayCount ?? 0,
          displayName: profile?.display_name ?? user.email?.split("@")[0] ?? "",
          reflection: { oneYearAgo: oneYearAgo ?? [] },
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <main>
      <GreetingCard
        theme={t}
        displayName={data?.displayName ?? ""}
        todayCount={data?.todayCount ?? 0}
        monthCount={data?.monthCount ?? 0}
      />
      <MoodCard />
      <QuickActions />
      {loading ? (
        <HomeSkeleton />
      ) : (
        data && <HomeCards entries={data.entries} reflection={data.reflection} />
      )}
    </main>
  );
}
