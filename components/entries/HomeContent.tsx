"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, ArrowRight, BookOpen, CalendarDays } from "lucide-react";
import { Entry, CATEGORY_ICONS } from "@/lib/types";

/* ── Helpers ── */
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric", weekday: "short",
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
  greeting: string;
  name: string;
  message: string;
  icon: string;
  heroGlow: string;
}> = {
  morning: {
    greeting: "おはようございます",
    name: "さん",
    message: "今日も新しい一日を、少しだけ残しておきましょう。",
    icon: "🌅",
    heroGlow: "rgba(56,189,248,0.15)",
  },
  noon: {
    greeting: "こんにちは",
    name: "さん",
    message: "今の気持ちや出来事を、未来の自分へ残しましょう。",
    icon: "☀️",
    heroGlow: "rgba(251,191,36,0.15)",
  },
  evening: {
    greeting: "お疲れ様です",
    name: "さん",
    message: "今日あったことを、ゆっくり振り返ってみませんか。",
    icon: "🌇",
    heroGlow: "rgba(244,114,182,0.12)",
  },
  night: {
    greeting: "おかえり",
    name: "さん",
    message: "一日の終わりに、今日の記憶を静かに残しましょう。",
    icon: "🌙",
    heroGlow: "rgba(139,124,248,0.15)",
  },
};

/* Category gradient backgrounds for cards without images */
const CAT_GRADIENTS: Record<string, string> = {
  思い出:   "linear-gradient(135deg, rgba(91,33,182,0.55) 0%, rgba(37,99,235,0.38) 100%)",
  健康:     "linear-gradient(135deg, rgba(5,150,105,0.55) 0%, rgba(6,182,212,0.38) 100%)",
  仕事:     "linear-gradient(135deg, rgba(30,58,138,0.55) 0%, rgba(67,56,202,0.38) 100%)",
  学習:     "linear-gradient(135deg, rgba(29,78,216,0.55) 0%, rgba(14,165,233,0.38) 100%)",
  お金:     "linear-gradient(135deg, rgba(180,83,9,0.55) 0%, rgba(217,119,6,0.38) 100%)",
  人間関係: "linear-gradient(135deg, rgba(194,65,12,0.55) 0%, rgba(190,18,60,0.38) 100%)",
  アイデア: "linear-gradient(135deg, rgba(126,34,206,0.55) 0%, rgba(219,39,119,0.38) 100%)",
  日常:     "linear-gradient(135deg, rgba(3,105,161,0.55) 0%, rgba(30,64,175,0.38) 100%)",
};

const CARD_ANIM = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: "easeOut" as const },
  }),
};

/* ── Timeline preview ── */
function TimelinePreview({ entries }: { entries: Entry[] }) {
  const now = new Date();
  const today     = now.toISOString().split("T")[0];
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  const weekAgo   = new Date(now); weekAgo.setDate(now.getDate() - 7);
  const monthAgo  = new Date(now); monthAgo.setDate(now.getDate() - 30);

  const buckets = [
    { label: "今日",     icon: "🕐", entries: entries.filter(e => e.entry_date === today) },
    { label: "昨日",     icon: "📅", entries: entries.filter(e => e.entry_date === yesterday.toISOString().split("T")[0]) },
    { label: "今週",     icon: "📆", entries: entries.filter(e => e.entry_date < yesterday.toISOString().split("T")[0] && e.entry_date >= weekAgo.toISOString().split("T")[0]) },
    { label: "今月",     icon: "🗓️", entries: entries.filter(e => e.entry_date < weekAgo.toISOString().split("T")[0] && e.entry_date >= monthAgo.toISOString().split("T")[0]) },
    { label: "それ以前", icon: "📚", entries: entries.filter(e => e.entry_date < monthAgo.toISOString().split("T")[0]) },
  ].filter(b => b.entries.length > 0);

  if (buckets.length === 0) return null;

  return (
    <div className="glass p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <CalendarDays style={{ width: 16, height: 16, color: "var(--accent)" }} strokeWidth={1.8} />
          <h3 className="text-[15px] font-semibold text-secondary">タイムラインプレビュー</h3>
        </div>
        <Link href="/timeline">
          <motion.span whileHover={{ x: 2 }}
            className="text-[12px] flex items-center gap-1 cursor-pointer font-medium"
            style={{ color: "var(--accent)" }}>
            年表で見る <ArrowRight style={{ width: 11, height: 11 }} />
          </motion.span>
        </Link>
      </div>

      <div className="space-y-0">
        {buckets.map((bucket, bi) => (
          <div key={bucket.label} className="flex gap-5">
            {/* Dot + line column */}
            <div className="flex flex-col items-center w-6 flex-shrink-0 pt-1">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: bi * 0.1 + 0.2, type: "spring", stiffness: 300 }}
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{
                  background: bi === 0 ? "var(--accent)" : "var(--glass-strong-bg)",
                  border: `2px solid ${bi === 0 ? "var(--accent)" : "var(--glass-border)"}`,
                  boxShadow: bi === 0 ? "0 0 8px var(--accent-glow)" : "none",
                }}
              />
              {bi < buckets.length - 1 && (
                <div className="flex-1 w-px my-1" style={{ background: "var(--glass-border)" }} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pb-5">
              <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">
                {bucket.icon} {bucket.label}
              </p>
              <div className="space-y-2">
                {bucket.entries.slice(0, 2).map((entry) => (
                  <Link key={entry.id} href={`/entries/${entry.id}`}>
                    <motion.div
                      whileHover={{ x: 3 }}
                      className="flex items-center gap-3 group cursor-pointer rounded-xl px-3 py-2 transition-all"
                      style={{ background: "var(--glass-bg)" }}
                    >
                      <span className="text-[16px] flex-shrink-0">{CATEGORY_ICONS[entry.category]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-primary truncate group-hover:text-accent transition-colors">
                          {entry.title}
                        </p>
                        <p className="text-[10px] text-muted">{formatDate(entry.entry_date)}</p>
                      </div>
                      <ArrowRight
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ width: 12, height: 12, color: "var(--accent)" }}
                      />
                    </motion.div>
                  </Link>
                ))}
                {bucket.entries.length > 2 && (
                  <p className="text-[11px] text-muted pl-3">+ 他 {bucket.entries.length - 2}件</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main component ── */
interface Props {
  entries: Entry[];
  monthCount: number;
  todayCount: number;
  displayName: string;
}

export function HomeContent({ entries, monthCount, todayCount, displayName }: Props) {
  const period = getPeriod();
  const { greeting, name, message, icon, heroGlow } = TIME_CONFIG[period];

  return (
    <div className="space-y-7 lg:space-y-9">

      {/* ══ HERO CARD ══ */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div
          className="glass-strong relative overflow-hidden"
          style={{
            padding: "clamp(24px, 4vw, 48px)",
            boxShadow: `0 16px 64px ${heroGlow}, 0 2px 0 rgba(255,255,255,0.07) inset`,
          }}
        >
          {/* Background glow blob */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "-30%", right: "-15%",
              width: "65%", height: "200%",
              background: `radial-gradient(ellipse, ${heroGlow} 0%, transparent 65%)`,
            }}
          />

          <div className="relative">
            {/* Date + icon */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">{icon}</span>
              <p className="text-[13px] text-muted font-medium">{todayFormatted()}</p>
            </div>

            {/* Greeting */}
            <p className="text-[14px] font-medium text-muted mb-1">{greeting}</p>
            <h1 className="font-bold text-primary leading-tight mb-1"
              style={{ fontSize: "clamp(26px, 4vw, 42px)" }}>
              <span className="shimmer-text">{displayName}</span>
              <span>{name}</span>
            </h1>
            <p className="text-[15px] lg:text-[17px] text-secondary leading-relaxed mb-8 max-w-xl">
              {message}
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link href="/entries/new">
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-3 rounded-2xl text-white font-semibold cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                    boxShadow: "0 4px 28px var(--accent-glow)",
                    padding: "14px 28px",
                    fontSize: "15px",
                  }}
                >
                  <Plus style={{ width: 18, height: 18 }} strokeWidth={2.5} />
                  今日を記録する
                </motion.div>
              </Link>

              {/* Soft stat badges */}
              <div className="flex gap-3 flex-wrap">
                <div
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
                  style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
                >
                  <BookOpen style={{ width: 14, height: 14, color: "var(--accent)" }} strokeWidth={1.8} />
                  <span className="text-[13px] text-secondary">
                    今日 <strong className="text-primary font-bold">{todayCount}</strong>件
                  </span>
                </div>
                <div
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
                  style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
                >
                  <CalendarDays style={{ width: 14, height: 14, color: "var(--accent)" }} strokeWidth={1.8} />
                  <span className="text-[13px] text-secondary">
                    今月 <strong className="text-primary font-bold">{monthCount}</strong>件
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ══ RECENT ENTRIES ══ */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-bold text-primary">最近の記録</h2>
          <Link href="/entries">
            <motion.span
              whileHover={{ x: 3 }}
              className="text-[13px] flex items-center gap-1.5 cursor-pointer font-medium"
              style={{ color: "var(--accent)" }}
            >
              すべて見る <ArrowRight style={{ width: 14, height: 14 }} />
            </motion.span>
          </Link>
        </div>

        {entries.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass p-14 text-center">
            <p className="text-5xl mb-4">✦</p>
            <p className="text-[15px] text-muted leading-relaxed mb-6">
              まだ記録がありません<br />最初の記録を残してみましょう
            </p>
            <Link href="/entries/new">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold cursor-pointer text-[14px]"
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                  boxShadow: "0 4px 20px var(--accent-glow)",
                }}>
                <Plus style={{ width: 15, height: 15 }} /> 記録を追加する
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
            {entries.slice(0, 6).map((entry, i) => (
              <motion.div key={entry.id} custom={i} variants={CARD_ANIM} initial="hidden" animate="visible">
                <Link href={`/entries/${entry.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.025, y: -5 }}
                    whileTap={{ scale: 0.97 }}
                    className="glass overflow-hidden cursor-pointer flex flex-col"
                    style={{
                      boxShadow: "var(--card-shadow)",
                      minHeight: 220,
                      transition: "box-shadow 0.2s ease",
                    }}
                    onHoverStart={(e) => {
                      (e.target as HTMLElement).style.boxShadow = "var(--card-hover-shadow)";
                    }}
                    onHoverEnd={(e) => {
                      (e.target as HTMLElement).style.boxShadow = "var(--card-shadow)";
                    }}
                  >
                    {/* Image or gradient placeholder */}
                    {entry.image_url ? (
                      <div className="relative overflow-hidden" style={{ height: 150 }}>
                        <img src={entry.image_url} alt="" className="w-full h-full object-cover"
                          style={{ opacity: 0.88 }} />
                        <div className="absolute inset-0"
                          style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.52))" }} />
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-center relative overflow-hidden"
                        style={{
                          height: 100,
                          background: CAT_GRADIENTS[entry.category] ?? CAT_GRADIENTS["日常"],
                        }}
                      >
                        <span className="text-4xl opacity-55">{CATEGORY_ICONS[entry.category]}</span>
                        {/* Subtle shine */}
                        <div className="absolute inset-0"
                          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)" }} />
                      </div>
                    )}

                    {/* Card body */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
                          style={{
                            background: "var(--glass-strong-bg)",
                            color: "var(--accent)",
                            border: "1px solid var(--glass-border)",
                          }}
                        >
                          {CATEGORY_ICONS[entry.category]} {entry.category}
                        </span>
                        <span className="text-[10px] text-muted ml-auto">{formatDate(entry.entry_date)}</span>
                      </div>
                      <p className="text-[15px] font-bold text-primary leading-snug mb-2">{entry.title}</p>
                      {entry.content && (
                        <p className="text-[13px] text-muted line-clamp-2 leading-relaxed flex-1">{entry.content}</p>
                      )}
                      <div
                        className="flex items-center justify-end mt-3 pt-3"
                        style={{ borderTop: "1px solid var(--glass-border)" }}
                      >
                        <span className="text-[12px] flex items-center gap-1" style={{ color: "var(--accent)" }}>
                          詳細を見る <ArrowRight style={{ width: 11, height: 11 }} strokeWidth={2} />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ══ TIMELINE PREVIEW ══ */}
      {entries.length > 0 && (
        <motion.div
          custom={8} variants={CARD_ANIM} initial="hidden" animate="visible"
        >
          <TimelinePreview entries={entries} />
        </motion.div>
      )}
    </div>
  );
}
