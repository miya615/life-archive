"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, ArrowRight, CalendarDays } from "lucide-react";
import { Entry, CATEGORY_ICONS } from "@/lib/types";
import { HomeReflections } from "./HomeReflections";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    month: "short", day: "numeric", weekday: "short",
  });
}
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
  greeting: string; subGreeting: string; message: string;
  heroGlow: string; btnText: string;
}> = {
  morning: {
    greeting: "おはようございます", subGreeting: "新しい一日が始まりました",
    message: "今朝の気持ちや決意を、未来の自分への手紙として残しておきましょう。",
    heroGlow: "rgba(56,189,248,0.12)", btnText: "今日を記録する",
  },
  noon: {
    greeting: "こんにちは", subGreeting: "今日も丁寧に過ごしていますか",
    message: "今の気持ちや出来事を、数年後の自分が読み返せるように残しましょう。",
    heroGlow: "rgba(251,191,36,0.12)", btnText: "今を記録する",
  },
  evening: {
    greeting: "おつかれさまです", subGreeting: "今日一日を振り返る時間です",
    message: "何気ない1日も、未来の自分には大切な記録です。今日を静かに残しましょう。",
    heroGlow: "rgba(244,114,182,0.10)", btnText: "今日を残す",
  },
  night: {
    greeting: "おかえり", subGreeting: "今日もよく頑張りました",
    message: "一日の終わりに、今日の記憶を静かに残しましょう。眠る前のほんの数分で。",
    heroGlow: "rgba(139,124,248,0.12)", btnText: "今日の記憶を残す",
  },
};

const CAT_GRADIENTS: Record<string, string> = {
  思い出:   "linear-gradient(135deg, rgba(91,33,182,0.50) 0%, rgba(37,99,235,0.35) 100%)",
  健康:     "linear-gradient(135deg, rgba(5,150,105,0.50) 0%, rgba(6,182,212,0.35) 100%)",
  仕事:     "linear-gradient(135deg, rgba(30,58,138,0.50) 0%, rgba(67,56,202,0.35) 100%)",
  学習:     "linear-gradient(135deg, rgba(29,78,216,0.50) 0%, rgba(14,165,233,0.35) 100%)",
  お金:     "linear-gradient(135deg, rgba(180,83,9,0.50) 0%, rgba(217,119,6,0.35) 100%)",
  人間関係: "linear-gradient(135deg, rgba(194,65,12,0.50) 0%, rgba(190,18,60,0.35) 100%)",
  アイデア: "linear-gradient(135deg, rgba(126,34,206,0.50) 0%, rgba(219,39,119,0.35) 100%)",
  日常:     "linear-gradient(135deg, rgba(3,105,161,0.50) 0%, rgba(30,64,175,0.35) 100%)",
};

interface Props {
  entries: Entry[];
  monthCount: number;
  todayCount: number;
  displayName: string;
}

export function HomeContent({ entries, monthCount, todayCount, displayName }: Props) {
  const period = getPeriod();
  const { greeting, subGreeting, message, heroGlow, btnText } = TIME_CONFIG[period];

  function narrativeStat() {
    if (todayCount === 0) return "今日はまだ記録がありません";
    return `今日、${todayCount}件の記憶を残しました`;
  }

  return (
    <div className="space-y-8 lg:space-y-10">

      {/* ══ HERO ══ */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div
          className="glass-strong relative overflow-hidden"
          style={{
            padding: "clamp(28px, 5vw, 52px)",
            boxShadow: `0 20px 60px ${heroGlow}, 0 1px 0 rgba(255,255,255,0.07) inset`,
          }}
        >
          {/* Decorative glow — pointer-events:none prevents blocking taps */}
          <div className="absolute pointer-events-none" style={{
            top: "-20%", right: "-10%", width: "55%", height: "180%",
            background: `radial-gradient(ellipse, ${heroGlow} 0%, transparent 68%)`,
          }} />

          <div className="relative">
            <p className="text-[12px] text-muted font-medium mb-6 tracking-wide">{todayFormatted()}</p>
            <p className="text-[13px] text-muted mb-1">{greeting}、</p>
            <h1 className="font-bold text-primary leading-tight mb-1"
              style={{ fontSize: "clamp(28px, 5vw, 46px)" }}>
              {displayName}さん
            </h1>
            <p className="text-[13px] text-muted mb-4 font-medium">{subGreeting}</p>
            <p className="text-[15px] lg:text-[17px] text-secondary leading-relaxed mb-8 max-w-lg"
              style={{ lineHeight: "1.75" }}>
              {message}
            </p>

            {/* CTA + stats */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/*
                FIX: <Link> directly with active:scale CSS.
                Wrapping motion.div inside <Link>/<a> causes iOS double-tap:
                first tap fires pointermove/hover on <a>, second fires click.
                CSS active: fires on touchstart — no JS event loop needed.
              */}
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
                <p className="text-[13px] text-secondary">{narrativeStat()}</p>
                <p className="text-[11px] text-muted">今月、合計 {monthCount}件の記録があります</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ══ RECENT ENTRIES ══ */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[17px] font-bold text-primary">最近の記録</h2>
            <p className="text-[11px] text-muted mt-0.5">あなたの思い出・気づき・出来事</p>
          </div>
          {/* FIX: Link直接に active: CSS — motion.span+whileTap inside Link も同様に二重タップ */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {entries.slice(0, 6).map((entry, i) => (
              <motion.div key={entry.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.38, ease: "easeOut" }}
              >
                {/*
                  FIX: <Link> is the tappable element with active: CSS.
                  No nested motion.div — removes the double-tap source entirely.
                */}
                <Link
                  href={`/entries/${entry.id}`}
                  className="glass overflow-hidden flex flex-col h-full active:scale-[0.98] active:opacity-90 transition-transform duration-100 block"
                  style={{ minHeight: 200, touchAction: "manipulation" }}
                >
                  {entry.image_url ? (
                    <div className="relative overflow-hidden" style={{ height: 140 }}>
                      <img src={entry.image_url} alt="" className="w-full h-full object-cover"
                        style={{ opacity: 0.9 }} />
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.55))" }} />
                      <div className="absolute bottom-3 left-4 pointer-events-none">
                        <span className="text-white text-[11px] font-semibold opacity-90">
                          {CATEGORY_ICONS[entry.category]} {entry.category}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center relative overflow-hidden" style={{ height: 88 }}>
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ background: CAT_GRADIENTS[entry.category] ?? CAT_GRADIENTS["日常"] }} />
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%)" }} />
                      <span className="relative text-4xl pointer-events-none" style={{ opacity: 0.5 }}>
                        {CATEGORY_ICONS[entry.category]}
                      </span>
                    </div>
                  )}

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: "var(--glass-strong-bg)", color: "var(--accent)", border: "1px solid var(--glass-border)" }}>
                        {entry.category}
                      </span>
                      <span className="text-[10px] text-muted ml-auto">{formatDate(entry.entry_date)}</span>
                    </div>
                    <p className="text-[15px] font-bold text-primary leading-snug mb-1.5">{entry.title}</p>
                    {entry.content && (
                      <p className="text-[12px] text-muted line-clamp-2 leading-relaxed flex-1">{entry.content}</p>
                    )}
                    <div className="flex items-center justify-end mt-3 pt-2.5"
                      style={{ borderTop: "1px solid var(--glass-border)" }}>
                      <span className="text-[11px] flex items-center gap-1" style={{ color: "var(--accent)" }}>
                        続きを読む <ArrowRight style={{ width: 10, height: 10 }} strokeWidth={2} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ══ REFLECTIONS ══ */}
      <HomeReflections />

    </div>
  );
}
