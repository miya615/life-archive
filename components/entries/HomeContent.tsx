"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, ArrowRight, CalendarDays } from "lucide-react";
import { Entry, CATEGORY_ICONS } from "@/lib/types";
import { formatDate, CAT_GRADIENTS } from "@/lib/utils";
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

interface Props {
  entries: Entry[];
  monthCount: number;
  todayCount: number;
  displayName: string;
  reflection: ReflectionData;
}

export function HomeContent({ entries, monthCount, todayCount, displayName, reflection }: Props) {
  const period = getPeriod();
  const { greeting, message, heroGlow, btnText } = TIME_CONFIG[period];

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
        transition={{ duration: 0.25, ease: "easeOut" }}
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
            <p className="text-[12px] text-muted font-medium mb-6 tracking-wide">{todayFormatted()}</p>
            <p className="text-[13px] text-muted mb-1">{greeting}、</p>
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
                transition={{ delay: i * 0.03, duration: 0.22, ease: "easeOut" }}
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

      {/* ══ REFLECTIONS ══ */}
      <HomeReflections data={reflection} />

    </div>
  );
}
