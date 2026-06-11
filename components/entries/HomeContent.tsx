"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, ArrowRight, BookOpen, CalendarDays, Image as ImageIcon } from "lucide-react";
import { Entry, CATEGORY_ICONS, Category } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
}

function todayFormatted() {
  return new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
}

type Period = "morning" | "noon" | "evening" | "night";

function getPeriod(): Period {
  const h = new Date().getHours();
  if (h >= 5  && h < 10) return "morning";
  if (h >= 10 && h < 17) return "noon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

const GREETINGS: Record<Period, { greeting: string; message: string; icon: string }> = {
  morning: { greeting: "おはようございます",  message: "今日も新しい一日を記録しましょう",     icon: "🌅" },
  noon:    { greeting: "こんにちは",          message: "今日の出来事を少し残しておきましょう",  icon: "☀️" },
  evening: { greeting: "お疲れ様です",        message: "今日を振り返る時間です",               icon: "🌇" },
  night:   { greeting: "おかえり",            message: "静かに一日を記録しましょう",           icon: "🌙" },
};

/* Gradient placeholders for entries without image */
const CAT_GRADIENTS: Record<string, string> = {
  日常:    "from-sky-700/50 to-blue-800/50",
  健康:    "from-emerald-700/50 to-teal-800/50",
  仕事:    "from-indigo-700/50 to-violet-800/50",
  学習:    "from-violet-700/50 to-purple-800/50",
  お金:    "from-amber-700/50 to-yellow-800/50",
  人間関係:"from-rose-700/50 to-pink-800/50",
  アイデア:"from-orange-700/50 to-red-800/50",
  思い出:  "from-pink-700/50 to-rose-800/50",
};

const FADE = {
  hidden:  { opacity: 0, y: 18 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45, ease: "easeOut" as const } }),
};

interface Props {
  entries: Entry[];
  monthCount: number;
  todayCount: number;
  displayName: string;
}

/* Timeline preview rows */
function TimelinePreview({ entries }: { entries: Entry[] }) {
  const now = new Date();
  const today     = now.toISOString().split("T")[0];
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  const weekAgo   = new Date(now); weekAgo.setDate(now.getDate() - 7);

  const buckets = [
    { label: "今日",     entries: entries.filter(e => e.entry_date === today) },
    { label: "昨日",     entries: entries.filter(e => e.entry_date === yesterdayStr) },
    { label: "今週",     entries: entries.filter(e => e.entry_date < yesterdayStr && e.entry_date >= weekAgo.toISOString().split("T")[0]) },
    { label: "それ以前", entries: entries.filter(e => e.entry_date < weekAgo.toISOString().split("T")[0]) },
  ].filter(b => b.entries.length > 0);

  if (buckets.length === 0) return null;

  return (
    <div className="glass p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-accent" strokeWidth={1.8} />
          <h3 className="text-sm font-semibold text-secondary">タイムラインプレビュー</h3>
        </div>
        <Link href="/timeline">
          <motion.span whileHover={{ x: 2 }} className="text-xs text-accent flex items-center gap-1 cursor-pointer">
            年表を見る <ArrowRight className="w-3 h-3" />
          </motion.span>
        </Link>
      </div>
      <div className="space-y-4">
        {buckets.map((bucket, bi) => (
          <div key={bucket.label} className="flex gap-4">
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center w-8 flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0"
                style={{ background: bi === 0 ? "var(--accent)" : "var(--glass-border)", border: bi === 0 ? "none" : "1px solid var(--glass-border)" }} />
              {bi < buckets.length - 1 && <div className="flex-1 w-px mt-1" style={{ background: "var(--glass-border)" }} />}
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0 pb-4">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">{bucket.label}</p>
              <div className="space-y-2">
                {bucket.entries.slice(0, 2).map((entry) => (
                  <Link key={entry.id} href={`/entries/${entry.id}`}>
                    <motion.div whileHover={{ x: 3 }} className="flex items-center gap-3 cursor-pointer group">
                      <span className="text-base flex-shrink-0">{CATEGORY_ICONS[entry.category]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary truncate group-hover:text-accent transition-colors">{entry.title}</p>
                        <p className="text-[10px] text-muted">{entry.category} · {formatDate(entry.entry_date)}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" strokeWidth={1.5} />
                    </motion.div>
                  </Link>
                ))}
                {bucket.entries.length > 2 && (
                  <p className="text-[10px] text-muted pl-9">他 {bucket.entries.length - 2}件</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomeContent({ entries, monthCount, todayCount, displayName }: Props) {
  const period = getPeriod();
  const { greeting, message, icon } = GREETINGS[period];

  return (
    <div className="space-y-6 lg:space-y-8">

      {/* ── Hero card ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <div className="glass-strong p-7 lg:p-9 relative overflow-hidden"
          style={{ boxShadow: "0 12px 60px var(--accent-glow), 0 2px 0 rgba(255,255,255,0.08) inset" }}>
          {/* Background glow */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }} />

          <div className="relative">
            {/* Date + icon */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{icon}</span>
              <p className="text-sm text-muted font-medium">{todayFormatted()}</p>
            </div>

            {/* Greeting */}
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-primary leading-tight mb-1">
              {greeting}、
            </h1>
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-3">
              <span className="shimmer-text">{displayName}</span>さん
            </h2>
            <p className="text-base text-muted mb-7">{message}</p>

            {/* CTA + stats row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link href="/entries/new">
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-3 px-7 py-4 rounded-2xl text-white font-semibold text-base cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                    boxShadow: "0 4px 28px var(--accent-glow)",
                  }}>
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
                  今日を記録する
                </motion.div>
              </Link>

              {/* Quick stats pills */}
              <div className="flex flex-wrap gap-3">
                <div className="glass px-4 py-2.5 rounded-2xl flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent" strokeWidth={1.8} />
                  <span className="text-sm text-secondary">今日 <strong className="text-primary font-bold">{todayCount}</strong>件</span>
                </div>
                <div className="glass px-4 py-2.5 rounded-2xl flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-accent" strokeWidth={1.8} />
                  <span className="text-sm text-secondary">今月 <strong className="text-primary font-bold">{monthCount}</strong>件</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Recent entries ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-primary">最近の記録</h2>
          <Link href="/entries">
            <motion.span whileHover={{ x: 3 }} className="text-sm text-accent flex items-center gap-1.5 cursor-pointer font-medium">
              すべて見る <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
        </div>

        {entries.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass p-14 text-center">
            <p className="text-5xl mb-4">✦</p>
            <p className="text-base text-muted leading-relaxed mb-6">まだ記録がありません<br />最初の記録を残してみましょう</p>
            <Link href="/entries/new">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold cursor-pointer"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", color: "white", boxShadow: "0 4px 20px var(--accent-glow)" }}>
                <Plus className="w-4 h-4" /> 記録を追加する
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {entries.slice(0, 9).map((entry, i) => (
              <motion.div key={entry.id} custom={i} variants={FADE} initial="hidden" animate="visible">
                <Link href={`/entries/${entry.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.025, y: -4 }} whileTap={{ scale: 0.97 }}
                    className="glass overflow-hidden cursor-pointer h-full flex flex-col"
                    style={{ boxShadow: "var(--card-shadow)", minHeight: 200 }}>
                    {/* Image or gradient placeholder */}
                    {entry.image_url ? (
                      <div className="relative overflow-hidden" style={{ height: 160 }}>
                        <img src={entry.image_url} alt="" className="w-full h-full object-cover opacity-85" />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.55))" }} />
                        <span className="absolute bottom-3 left-3 text-[10px] px-2 py-0.5 rounded-full font-medium text-white"
                          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}>
                          <ImageIcon className="inline w-2.5 h-2.5 mr-1" strokeWidth={2} />{entry.category}
                        </span>
                      </div>
                    ) : (
                      <div className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-br ${CAT_GRADIENTS[entry.category] ?? "from-violet-800/40 to-indigo-900/40"}`}
                        style={{ height: 100 }}>
                        <span className="text-4xl opacity-60">{CATEGORY_ICONS[entry.category]}</span>
                      </div>
                    )}

                    <div className="p-4 lg:p-5 flex-1 flex flex-col">
                      {/* Category + date */}
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
                          style={{ background: "var(--glass-strong-bg)", color: "var(--accent)", border: "1px solid var(--glass-border)" }}>
                          {CATEGORY_ICONS[entry.category]} {entry.category}
                        </span>
                        <span className="text-[10px] text-muted ml-auto">{formatDate(entry.entry_date)}</span>
                      </div>
                      {/* Title */}
                      <p className="text-base font-bold text-primary leading-snug mb-1.5">{entry.title}</p>
                      {/* Content preview */}
                      {entry.content && (
                        <p className="text-sm text-muted line-clamp-2 leading-relaxed flex-1">{entry.content}</p>
                      )}
                      {/* Detail link */}
                      <div className="flex items-center justify-end mt-3 pt-3"
                        style={{ borderTop: "1px solid var(--glass-border)" }}>
                        <span className="text-xs text-accent flex items-center gap-1">
                          詳細を見る <ArrowRight className="w-3 h-3" strokeWidth={2} />
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

      {/* ── Timeline preview ── */}
      {entries.length > 0 && (
        <motion.div custom={10} variants={FADE} initial="hidden" animate="visible">
          <TimelinePreview entries={entries} />
        </motion.div>
      )}
    </div>
  );
}
