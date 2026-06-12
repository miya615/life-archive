"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Quote, TrendingUp } from "lucide-react";
import { CATEGORY_ICONS } from "@/lib/types";
import type { ReflectionData } from "@/lib/utils";

export function HomeReflections({ data }: { data: ReflectionData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="space-y-4 mt-2"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Daily quote */}
        <div className="glass p-5" style={{ borderLeft: "2px solid var(--accent)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Quote style={{ width: 12, height: 12, color: "var(--accent)" }} strokeWidth={1.8} />
            <p className="text-[10px] font-semibold text-muted uppercase tracking-widest">今日の言葉</p>
          </div>
          <p className="text-[13px] text-secondary leading-relaxed" style={{ fontStyle: "italic" }}>
            &ldquo;{data.quote}&rdquo;
          </p>
        </div>

        {/* Week summary */}
        <div className="glass p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp style={{ width: 12, height: 12, color: "var(--accent)" }} strokeWidth={1.8} />
            <p className="text-[10px] font-semibold text-muted uppercase tracking-widest">今週のあなた</p>
          </div>
          {data.weekCount === 0 ? (
            <p className="text-[13px] text-muted">今週はまだ記録がありません</p>
          ) : (
            <>
              <p className="text-[13px] text-secondary mb-3">
                今週、<span className="text-primary font-bold text-[16px]">{data.weekCount}</span>件の記録を残しました
              </p>
              {data.weekTopCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.weekTopCategories.map(({ cat, count }) => (
                    <span key={cat} className="text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1"
                      style={{ background: "var(--glass-strong-bg)", color: "var(--accent)", border: "1px solid var(--glass-border)" }}>
                      {CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS]} {cat} {count}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 1 year ago */}
      {data.oneYearAgo.length > 0 && (
        <div className="glass p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles style={{ width: 13, height: 13, color: "var(--accent)" }} strokeWidth={1.8} />
              <p className="text-[13px] font-semibold text-secondary">1年前の今日</p>
            </div>
            <Link href="/timeline"
              className="text-[11px] flex items-center gap-1 active:opacity-60 transition-opacity duration-100"
              style={{ color: "var(--accent)", touchAction: "manipulation" }}>
              もっと見る <ArrowRight style={{ width: 10, height: 10 }} />
            </Link>
          </div>
          <div className="space-y-2.5">
            {data.oneYearAgo.map((entry) => (
              <Link key={entry.id} href={`/entries/${entry.id}`}
                className="flex items-start gap-3 p-3 rounded-xl active:scale-[0.98] active:opacity-80 transition-transform duration-100 block"
                style={{ background: "var(--glass-bg)", touchAction: "manipulation" }}
              >
                <span className="text-lg flex-shrink-0 mt-0.5">{CATEGORY_ICONS[entry.category]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-primary truncate">{entry.title}</p>
                  <p className="text-[10px] text-muted mt-0.5">
                    {new Date(entry.entry_date).getFullYear()}年 · {entry.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
