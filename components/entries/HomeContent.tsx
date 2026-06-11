"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, ArrowRight, BookOpen, Clock } from "lucide-react";
import { Entry, CATEGORY_ICONS, CATEGORIES, Category } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric", weekday: "short",
  });
}

function todayJP() {
  return new Date().toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric", weekday: "long",
  });
}

function greetingByTime() {
  const h = new Date().getHours();
  if (h >= 5 && h < 10) return "おはようございます";
  if (h >= 10 && h < 17) return "こんにちは";
  if (h >= 17 && h < 21) return "お疲れ様です";
  return "おかえり";
}

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const } }),
};

interface Props {
  entries: Entry[];
  monthCount: number;
  displayName: string;
}

export function HomeContent({ entries, monthCount, displayName }: Props) {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-xs text-muted font-medium tracking-widest uppercase mb-2">{todayJP()}</p>
        <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-primary leading-tight">
          {greetingByTime()}、<span className="shimmer-text">{displayName}</span>さん
        </h1>
        <p className="text-sm text-muted mt-2">今日もあなたの人生の1ページを記録しましょう</p>
      </motion.div>

      {/* Quick add — hero card */}
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.4 }}>
        <Link href="/entries/new">
          <motion.div
            whileHover={{ scale: 1.015, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="glass-strong p-5 lg:p-6 cursor-pointer"
            style={{ boxShadow: "0 8px 40px var(--accent-glow)" }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.25 }}
                className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", boxShadow: "0 4px 16px var(--accent-glow)" }}
              >
                <Plus className="w-5 h-5 lg:w-6 lg:h-6 text-white" strokeWidth={2.5} />
              </motion.div>
              <div className="flex-1">
                <p className="text-sm lg:text-base font-semibold text-primary">今日は何を残しますか？</p>
                <p className="text-xs text-muted mt-0.5">思い出・学び・気づきを記録する</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted flex-shrink-0" strokeWidth={1.5} />
            </div>

            {/* Category quick picks */}
            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <Link key={cat} href={`/entries/new`} onClick={(e) => e.stopPropagation()}>
                  <motion.span
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs px-3 py-1.5 rounded-full cursor-pointer glass"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {CATEGORY_ICONS[cat as Category]} {cat}
                  </motion.span>
                </Link>
              ))}
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 lg:gap-4">
        {[
          { label: "今月の記録", value: monthCount, unit: "件", icon: BookOpen, href: "/entries" },
          { label: "人生年表", value: "振り返る", unit: "", icon: Clock, href: "/timeline" },
        ].map((item, i) => (
          <motion.div key={i} custom={i} variants={CARD_VARIANTS} initial="hidden" animate="visible">
            <Link href={item.href}>
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="glass p-5 lg:p-6 cursor-pointer h-full"
              >
                <div className="flex items-start justify-between mb-3">
                  <item.icon className="w-4 h-4 text-accent" strokeWidth={1.8} />
                  <ArrowRight className="w-3.5 h-3.5 text-muted" strokeWidth={1.5} />
                </div>
                <p className="text-xs text-muted mb-1">{item.label}</p>
                <p className="text-2xl lg:text-3xl font-bold text-primary">
                  {item.value}
                  {item.unit && <span className="text-sm font-medium text-muted ml-1">{item.unit}</span>}
                </p>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent entries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-secondary">最近の記録</h2>
          <Link href="/entries">
            <motion.span
              whileHover={{ x: 3 }}
              className="text-xs text-accent flex items-center gap-1 cursor-pointer"
            >
              すべて見る <ArrowRight className="w-3 h-3" />
            </motion.span>
          </Link>
        </div>

        {entries.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-12 text-center">
            <p className="text-5xl mb-4">✦</p>
            <p className="text-sm text-muted leading-relaxed">まだ記録がありません<br />最初の記録を残してみましょう</p>
            <Link href="/entries/new">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-2xl text-sm font-medium"
                style={{ background: "var(--glass-strong-bg)", color: "var(--accent)", border: "1px solid var(--glass-border)" }}
              >
                <Plus className="w-4 h-4" /> 記録を追加する
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {entries.map((entry, i) => (
              <motion.div key={entry.id} custom={i + 2} variants={CARD_VARIANTS} initial="hidden" animate="visible">
                <Link href={`/entries/${entry.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    className="glass overflow-hidden cursor-pointer h-full flex flex-col"
                    style={{ boxShadow: "var(--card-shadow)" }}
                  >
                    {entry.image_url && (
                      <div className="relative overflow-hidden" style={{ height: 140 }}>
                        <img src={entry.image_url} alt="" className="w-full h-full object-cover" style={{ opacity: 0.85 }} />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4))" }} />
                      </div>
                    )}
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ background: "var(--glass-strong-bg)", color: "var(--accent)", border: "1px solid var(--glass-border)" }}>
                          {CATEGORY_ICONS[entry.category]} {entry.category}
                        </span>
                        <span className="text-[10px] text-muted ml-auto">{formatDate(entry.entry_date)}</span>
                      </div>
                      <p className="text-sm font-semibold text-primary leading-snug">{entry.title}</p>
                      {entry.content && (
                        <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed flex-1">{entry.content}</p>
                      )}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
