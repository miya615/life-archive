"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, ArrowRight, CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Entry, CATEGORY_ICONS, CARD_STYLES } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import type { ReflectionData } from "@/lib/utils";
import { HomeReflections } from "./HomeReflections";
import { WeightCard } from "@/components/weight/WeightCard";

function todayFormatted() {
  return new Date().toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric", weekday: "long",
  });
}

type Period = "morning" | "noon" | "evening" | "night";

interface TimeTheme {
  greeting: string;
  message: string;
  btnText: string;
  background: string;
  textColor: string;
  subTextColor: string;
  accentColor: string;
  ctaBackground: string;
  glow: string;
  /** decorative radial highlight position & color */
  glowOrb: string;
  isNight: boolean;
}

const TIME_THEMES: Record<Period, TimeTheme> = {
  morning: {
    greeting: "おはようございます",
    message: "今朝の気持ちや決意を、未来の自分への手紙として残しておきましょう。",
    btnText: "今日を記録する",
    background: "linear-gradient(135deg, #FFF7E6 0%, #EAF6FF 55%, #FFF1C7 100%)",
    textColor: "#0F172A",
    subTextColor: "#64748B",
    accentColor: "#F59E0B",
    ctaBackground: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
    glow: "0 20px 60px rgba(245,158,11,0.20)",
    glowOrb: "radial-gradient(ellipse 55% 180% at 90% -10%, rgba(251,191,36,0.22) 0%, transparent 70%)",
    isNight: false,
  },
  noon: {
    greeting: "こんにちは",
    message: "今の気持ちや出来事を、数年後の自分が読み返せるように残しましょう。",
    btnText: "今を記録",
    background: "linear-gradient(135deg, #FFFFFF 0%, #EEF7FF 45%, #FFE8B8 100%)",
    textColor: "#0F172A",
    subTextColor: "#64748B",
    accentColor: "#F97316",
    ctaBackground: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
    glow: "0 20px 60px rgba(249,115,22,0.18)",
    glowOrb: "radial-gradient(ellipse 55% 180% at 90% -10%, rgba(249,115,22,0.18) 0%, transparent 70%)",
    isNight: false,
  },
  evening: {
    greeting: "おつかれさまです",
    message: "何気ない1日も、未来の自分には大切な記録です。今日を静かに残しましょう。",
    btnText: "今日を残す",
    background: "linear-gradient(135deg, #FFF0D9 0%, #FDBA74 50%, #E9D5FF 100%)",
    textColor: "#111827",
    subTextColor: "#6B7280",
    accentColor: "#EA580C",
    ctaBackground: "linear-gradient(135deg, #EA580C 0%, #F97316 100%)",
    glow: "0 24px 70px rgba(234,88,12,0.25)",
    glowOrb: "radial-gradient(ellipse 55% 180% at 88% -5%, rgba(253,186,116,0.35) 0%, transparent 68%)",
    isNight: false,
  },
  night: {
    greeting: "おかえり",
    message: "一日の終わりに、今日の記憶を静かに残しましょう。眠る前のほんの数分で。",
    btnText: "今日の記憶を残す",
    background: "linear-gradient(135deg, #0F172A 0%, #312E81 55%, #1E1B4B 100%)",
    textColor: "#F8FAFC",
    subTextColor: "#CBD5E1",
    accentColor: "#A78BFA",
    ctaBackground: "linear-gradient(135deg, #F59E0B 0%, #FDBA74 100%)",
    glow: "0 24px 80px rgba(167,139,250,0.25)",
    glowOrb: "radial-gradient(ellipse 55% 180% at 88% -5%, rgba(167,139,250,0.28) 0%, transparent 68%)",
    isNight: true,
  },
};

function getTimeTheme(hour: number): TimeTheme {
  if (hour >= 5  && hour < 11) return TIME_THEMES.morning;
  if (hour >= 11 && hour < 16) return TIME_THEMES.noon;
  if (hour >= 16 && hour < 19) return TIME_THEMES.evening;
  return TIME_THEMES.night;
}

interface HomeData {
  entries: Entry[];
  monthCount: number;
  todayCount: number;
  displayName: string;
  reflection: ReflectionData;
}

/* ── サブコンポーネント ── */

function HomeHeader({ theme }: { theme: TimeTheme }) {
  return (
    <div className="px-5 pt-6 pb-2">
      <p className="text-[11px] text-muted font-medium tracking-wide">{todayFormatted()}</p>
      <p className="text-[13px] text-muted mt-1">{theme.greeting}</p>
    </div>
  );
}

function TodayHero({ displayName, todayCount, monthCount, theme }: {
  displayName: string;
  todayCount: number;
  monthCount: number;
  theme: TimeTheme;
}) {
  return (
    <div className="mx-4 mb-6">
      <div
        className="relative overflow-hidden"
        style={{
          padding: "clamp(28px, 5vw, 52px)",
          background: theme.background,
          borderRadius: 28,
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: theme.glow,
        }}
      >
        {/* decorative glow orb */}
        <div className="absolute pointer-events-none inset-0" style={{ background: theme.glowOrb }} />
        {/* inner top highlight */}
        <div className="absolute pointer-events-none inset-x-0 top-0 h-px" style={{ background: "rgba(255,255,255,0.6)" }} />

        <div className="relative">
          {displayName ? (
            <h1 className="font-bold leading-tight mb-4"
              style={{ fontSize: "clamp(28px, 5vw, 46px)", color: theme.textColor }}>
              {displayName}さん
            </h1>
          ) : (
            <div className="h-10 w-40 rounded-2xl animate-pulse mb-4"
              style={{ background: theme.isNight ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.07)" }} />
          )}
          <p className="text-[15px] lg:text-[17px] leading-relaxed mb-8 max-w-lg"
            style={{ lineHeight: "1.75", color: theme.subTextColor }}>
            {theme.message}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              href="/entries/new"
              className="inline-flex items-center gap-2.5 rounded-2xl font-semibold active:scale-[0.96] active:opacity-90 transition-transform duration-100"
              style={{
                background: theme.ctaBackground,
                boxShadow: `0 6px 24px ${theme.isNight ? "rgba(245,158,11,0.35)" : `${theme.accentColor}44`}`,
                padding: "14px 28px",
                fontSize: "15px",
                color: "#ffffff",
                touchAction: "manipulation",
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
            >
              <Plus style={{ width: 17, height: 17 }} strokeWidth={2.5} />
              {theme.btnText}
            </Link>

            <div className="flex flex-col gap-0.5">
              <p className="text-[13px]" style={{ color: theme.subTextColor }}>
                {todayCount === 0 ? "今日はまだ記録がありません" : `今日、${todayCount}件の記憶を残しました`}
              </p>
              <p className="text-[11px]" style={{ color: theme.isNight ? "rgba(203,213,225,0.7)" : "rgba(100,116,139,0.8)" }}>
                今月、合計 {monthCount}件の記録があります
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="space-y-4 px-4 animate-pulse">
      <div className="h-5 w-32 rounded-full bg-slate-100" />
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-[20px] bg-slate-100" style={{ height: 160 }} />
        ))}
      </div>
    </div>
  );
}

function HomeCards({ entries, reflection }: { entries: Entry[]; reflection: ReflectionData }) {
  return (
    <div className="space-y-8 px-4">
      {/* 体重カード */}
      <WeightCard />

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
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", boxShadow: "0 4px 20px var(--accent-glow)", touchAction: "manipulation" }}
            >
              <Plus style={{ width: 14, height: 14 }} /> 最初の記録を書く
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {entries.slice(0, 6).map((entry, i) => {
              const cs = CARD_STYLES[entry.category] ?? CARD_STYLES["日常"];
              return (
                <motion.div key={entry.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.10), duration: 0.14, ease: "easeOut" }}
                >
                  <Link
                    href={`/entries/${entry.id}`}
                    className="overflow-hidden flex flex-col active:scale-[0.98] active:opacity-90 transition-transform duration-100 block rounded-[20px]"
                    style={{ touchAction: "manipulation", background: cs.bg, border: `1px solid ${cs.borderColor}`, boxShadow: "var(--card-shadow)" }}
                  >
                    {entry.image_url ? (
                      <div className="relative overflow-hidden flex-shrink-0" style={{ height: 96 }}>
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
                      <div className="flex items-center justify-center flex-shrink-0" style={{ height: 56, background: `${cs.accent}22` }}>
                        <span className="text-2xl" style={{ opacity: 0.7 }}>
                          {CATEGORY_ICONS[entry.category]}
                        </span>
                      </div>
                    )}

                    <div className="px-3 pt-2.5 pb-3 flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold leading-none" style={{ color: cs.labelColor }}>
                          {entry.category}
                        </span>
                        <span className="text-[10px] text-muted ml-auto whitespace-nowrap">{formatDate(entry.entry_date)}</span>
                      </div>
                      <p className="text-[13px] font-bold text-primary leading-snug line-clamp-2 break-words">{entry.title}</p>
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

/* ── メインコンポーネント ── */

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
          reflection: {
            oneYearAgo: oneYearAgo ?? [],
          },
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <main className="min-h-dvh">
      <HomeHeader theme={t} />
      <TodayHero
        displayName={data?.displayName ?? ""}
        todayCount={data?.todayCount ?? 0}
        monthCount={data?.monthCount ?? 0}
        theme={t}
      />
      {loading ? (
        <HomeSkeleton />
      ) : (
        data && <HomeCards entries={data.entries} reflection={data.reflection} />
      )}
    </main>
  );
}
