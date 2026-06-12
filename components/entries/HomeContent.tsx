"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight, CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Entry, CATEGORY_ICONS } from "@/lib/types";
import { formatDate, CAT_GRADIENTS, getDailyQuote } from "@/lib/utils";
import type { ReflectionData } from "@/lib/utils";
import { HomeReflections } from "./HomeReflections";

function todayFormatted() {
  return new Date().toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric", weekday: "long",
  });
}

type Period = "morning" | "noon" | "evening" | "night";
function getPeriod(): Period {
  const h = new Date().getHours();
  if (h >= 5  && h < 10) return "morning";
  if (h >= 10 && h < 17) return "noon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

const TIME_CONFIG: Record<Period, {
  greeting: string; message: string;
  heroGlow: string; btnText: string;
}> = {
  morning: {
    greeting: "おはようございます",
    message: "今朝の気持ちや決意を、未来の自分への手紙として残しておきましょう。",
    heroGlow: "rgba(56,189,248,0.12)", btnText: "今日を記録する",
  },
  noon: {
    greeting: "こんにちは",
    message: "今の気持ちや出来事を、数年後の自分が読み返せるように残しましょう。",
    heroGlow: "rgba(251,191,36,0.12)", btnText: "今を記録する",
  },
  evening: {
    greeting: "おつかれさまです",
    message: "何気ない1日も、未来の自分には大切な記録です。今日を静かに残しましょう。",
    heroGlow: "rgba(244,114,182,0.10)", btnText: "今日を残す",
  },
  night: {
    greeting: "おかえり",
    message: "一日の終わりに、今日の記憶を静かに残しましょう。眠る前のほんの数分で。",
    heroGlow: "rgba(139,124,248,0.12)", btnText: "今日の記憶を残す",
  },
};

interface HomeData {
  entries: Entry[];
  monthCount: number;
  todayCount: number;
  displayName: string;
  reflection: ReflectionData;
}

/* ── サブコンポーネント ── */

function HomeHeader() {
  const period = getPeriod();
  const { greeting } = TIME_CONFIG[period];
  return (
    <div className="px-5 pt-6 pb-2">
      <p className="text-[11px] text-muted font-medium tracking-wide">{todayFormatted()}</p>
      <p className="text-[13px] text-muted mt-1">{greeting}</p>
    </div>
  );
}

function TodayHero({ displayName, todayCount, monthCount }: {
  displayName: string;
  todayCount: number;
  monthCount: number;
}) {
  const period = getPeriod();
  const { message, heroGlow, btnText } = TIME_CONFIG[period];

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mx-4 mb-6"
    >
      <div
        className="glass-strong relative overflow-hidden"
        style={{
          padding: "clamp(28px, 5vw, 52px)",
          boxShadow: `0 20px 60px ${heroGlow}, 0 1px 0 rgba(255,255,255,0.07) inset`,
        }}
      >
        <div className="absolute pointer-events-none" style={{
          top: "-20%", right: "-10%", width: "55%", height: "180%",
          background: `radial-gradient(ellipse, ${heroGlow} 0%, transparent 68%)`,
        }} />

        <div className="relative">
          <h1 className="font-bold text-primary leading-tight mb-4"
            style={{ fontSize: "clamp(28px, 5vw, 46px)" }}>
            {displayName}さん
          </h1>
          <p className="text-[15px] lg:text-[17px] text-secondary leading-relaxed mb-8 max-w-lg"
            style={{ lineHeight: "1.75" }}>
            {message}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              href="/entries/new"
              className="inline-flex items-center gap-2.5 rounded-2xl text-white font-semibold active:scale-[0.96] active:opacity-90 transition-transform duration-100"
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                boxShadow: "0 6px 28px var(--accent-glow)",
                padding: "14px 28px",
                fontSize: "15px",
                touchAction: "manipulation",
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
            >
              <Plus style={{ width: 17, height: 17 }} strokeWidth={2.5} />
              {btnText}
            </Link>

            <div className="flex flex-col gap-0.5">
              <p className="text-[13px] text-secondary">
                {todayCount === 0 ? "今日はまだ記録がありません" : `今日、${todayCount}件の記憶を残しました`}
              </p>
              <p className="text-[11px] text-muted">今月、合計 {monthCount}件の記録があります</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HomeSkeleton() {
  return (
    <div className="space-y-6 px-4 animate-pulse">
      <div className="glass-strong rounded-[24px]" style={{ height: 260 }} />
      <div className="space-y-4">
        <div className="h-5 w-32 rounded-full bg-slate-100" />
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-[20px] bg-slate-100" style={{ height: 160 }} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-[20px] bg-slate-100" style={{ height: 100 }} />
        <div className="rounded-[20px] bg-slate-100" style={{ height: 100 }} />
      </div>
    </div>
  );
}

function HomeCards({ entries, reflection }: { entries: Entry[]; reflection: ReflectionData }) {
  return (
    <div className="space-y-8 px-4">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[17px] font-bold text-primary">最近の記録</h2>
            <p className="text-[11px] text-muted mt-0.5">あなたの思い出・気づき・出来事</p>
          </div>
          <Link
            href="/entries"
            className="text-[12px] flex items-center gap-1 font-medium active:opacity-60 transition-opacity duration-100"
            style={{ color: "var(--accent)", touchAction: "manipulation" }}
          >
            すべて見る <ArrowRight style={{ width: 12, height: 12 }} />
          </Link>
        </div>

        {entries.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass p-14 text-center">
            <div className="w-14 h-14 rounded-3xl mx-auto mb-5 flex items-center justify-center"
              style={{ background: "var(--glass-strong-bg)" }}>
              <CalendarDays style={{ width: 24, height: 24, color: "var(--accent)" }} strokeWidth={1.5} />
            </div>
            <p className="text-[15px] text-secondary font-medium mb-1">まだ記録がありません</p>
            <p className="text-[13px] text-muted mb-6">最初の1ページを残してみましょう</p>
            <Link
              href="/entries/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold text-[14px] active:scale-[0.97] active:opacity-90 transition-transform duration-100"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", boxShadow: "0 4px 20px var(--accent-glow)", touchAction: "manipulation" }}
            >
              <Plus style={{ width: 14, height: 14 }} /> 最初の記録を書く
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {entries.slice(0, 6).map((entry, i) => (
              <motion.div key={entry.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.10), duration: 0.14, ease: "easeOut" }}
              >
                <Link
                  href={`/entries/${entry.id}`}
                  className="glass overflow-hidden flex flex-col h-full active:scale-[0.98] active:opacity-90 transition-transform duration-100 block"
                  style={{ minHeight: 160, touchAction: "manipulation" }}
                >
                  {entry.image_url ? (
                    <div className="relative overflow-hidden" style={{ height: 100 }}>
                      <img src={entry.image_url} alt="" className="w-full h-full object-cover"
                        style={{ opacity: 0.92 }} />
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.45))" }} />
                      <div className="absolute bottom-2 left-3 pointer-events-none">
                        <span className="text-white text-[10px] font-semibold opacity-90">
                          {CATEGORY_ICONS[entry.category]}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center relative overflow-hidden" style={{ height: 68 }}>
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ background: CAT_GRADIENTS[entry.category] ?? CAT_GRADIENTS["日常"] }} />
                      <span className="relative text-3xl pointer-events-none" style={{ opacity: 0.55 }}>
                        {CATEGORY_ICONS[entry.category]}
                      </span>
                    </div>
                  )}

                  <div className="px-4 py-3 flex-1 flex flex-col">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[13px] font-bold leading-none" style={{ color: "var(--accent)" }}>
                        {entry.category}
                      </span>
                      <span className="text-[11px] text-muted ml-auto whitespace-nowrap">{formatDate(entry.entry_date)}</span>
                    </div>
                    <p className="text-[13px] font-bold text-primary leading-snug line-clamp-1 mb-1">{entry.title}</p>
                    {entry.content && (
                      <p className="text-[11px] text-muted line-clamp-2 leading-relaxed flex-1 break-words">{entry.content}</p>
                    )}
                    <div className="flex items-center justify-end mt-2 pt-2"
                      style={{ borderTop: "1px solid var(--glass-border)" }}>
                      <span className="text-[11px] font-semibold flex items-center gap-0.5" style={{ color: "var(--accent)" }}>
                        続きを読む <ArrowRight style={{ width: 9, height: 9 }} strokeWidth={2.5} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <HomeReflections data={reflection} />
    </div>
  );
}

/* ── メインコンポーネント ── */

export function HomeContent() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null
        if (!mounted) return null

        const now = new Date();
        const today = now.toISOString().split("T")[0];
        function pad(n: number) { return String(n).padStart(2, "0"); }
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
        const mm = pad(now.getMonth() + 1);
        const dd = pad(now.getDate());
        const thisYear = now.getFullYear();
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekAgoStr = weekAgo.toISOString().split("T")[0];

        const [
          { data: recentEntries },
          { count: monthCount },
          { count: todayCount },
          { data: profile },
          { data: oneYearAgo },
          { count: weekCount },
          { data: weekEntries },
        ] = await Promise.all([
          supabase.from("entries").select("*").eq("user_id", user.id).order("entry_date", { ascending: false }).limit(10),
          supabase.from("entries").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("entry_date", startOfMonth),
          supabase.from("entries").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("entry_date", today),
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase.from("entries").select("*").eq("user_id", user.id).like("entry_date", `%-${mm}-${dd}`).neq("entry_date", `${thisYear}-${mm}-${dd}`).order("entry_date", { ascending: false }).limit(2),
          supabase.from("entries").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("entry_date", weekAgoStr),
          supabase.from("entries").select("category").eq("user_id", user.id).gte("entry_date", weekAgoStr),
        ]);

        if (!mounted) return;

        const catMap: Record<string, number> = {};
        for (const r of weekEntries ?? []) {
          catMap[r.category] = (catMap[r.category] ?? 0) + 1;
        }
        const weekTopCategories = Object.entries(catMap)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([cat, count]) => ({ cat, count }));

        setData({
          entries: recentEntries ?? [],
          monthCount: monthCount ?? 0,
          todayCount: todayCount ?? 0,
          displayName: profile?.display_name ?? user.email?.split("@")[0] ?? "",
          reflection: {
            oneYearAgo: oneYearAgo ?? [],
            weekCount: weekCount ?? 0,
            weekTopCategories,
            quote: getDailyQuote(now),
          },
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const entries = data?.entries ?? null;

  return (
    <main className="min-h-dvh">
      <HomeHeader />
      {data && (
        <TodayHero
          displayName={data.displayName}
          todayCount={data.todayCount}
          monthCount={data.monthCount}
        />
      )}

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <HomeSkeleton />
          </motion.div>
        ) : (
          entries && data && (
            <motion.div key="cards" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
              <HomeCards entries={entries} reflection={data.reflection} />
            </motion.div>
          )
        )}
      </AnimatePresence>
    </main>
  );
}
