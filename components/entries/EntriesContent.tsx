"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X, ArrowRight } from "lucide-react";
import { Entry, Category, CATEGORIES, CATEGORY_ICONS } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", { month: "short", day: "numeric", weekday: "short" });
}

const CAT_GRADIENTS: Record<string, string> = {
  思い出: "linear-gradient(135deg, rgba(139,92,246,0.13) 0%, rgba(59,130,246,0.09) 100%)",
  健康:   "linear-gradient(135deg, rgba(16,185,129,0.13) 0%, rgba(6,182,212,0.09) 100%)",
  仕事:   "linear-gradient(135deg, rgba(59,130,246,0.13) 0%, rgba(99,102,241,0.09) 100%)",
  学習:   "linear-gradient(135deg, rgba(14,165,233,0.13) 0%, rgba(59,130,246,0.09) 100%)",
  お金:   "linear-gradient(135deg, rgba(245,158,11,0.13) 0%, rgba(234,179,8,0.09) 100%)",
  人間関係:"linear-gradient(135deg, rgba(239,68,68,0.13) 0%, rgba(236,72,153,0.09) 100%)",
  アイデア:"linear-gradient(135deg, rgba(168,85,247,0.13) 0%, rgba(236,72,153,0.09) 100%)",
  日常:   "linear-gradient(135deg, rgba(14,165,233,0.13) 0%, rgba(59,130,246,0.09) 100%)",
};

const CARD = {
  hidden:  { opacity: 0, y: 16, scale: 0.97 },
  visible: (i: number) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.04, duration: 0.38, ease: "easeOut" as const } }),
};

export function EntriesContent({ entries }: { entries: Entry[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "すべて">("すべて");

  const filtered = entries.filter((e) => {
    const matchCat = selectedCategory === "すべて" || e.category === selectedCategory;
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || (e.content?.toLowerCase() ?? "").includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-primary">記録一覧</h1>
          <p className="text-sm text-muted mt-1">{filtered.length}件の記録</p>
        </div>
        <Link href="/entries/new">
          <div
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-semibold text-sm cursor-pointer active:scale-95 transition-transform duration-100"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", boxShadow: "0 4px 20px var(--accent-glow)", touchAction: "manipulation" }}>
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">新しい記録</span>
          </div>
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="glass flex items-center gap-3 px-5 py-4">
        <Search className="w-5 h-5 flex-shrink-0 text-muted" strokeWidth={1.8} />
        <input type="text" placeholder="タイトル・本文でキーワード検索..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm lg:text-base text-primary placeholder:text-muted" />
        <AnimatePresence>
          {search && (
            <motion.button initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => setSearch("")} className="text-muted hover:text-secondary transition-colors">
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Category filter */}
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
        {(["すべて", ...CATEGORIES] as const).map((cat, i) => (
          <button key={cat}
            onClick={() => setSelectedCategory(cat as Category | "すべて")}
            className="flex-shrink-0 text-sm font-semibold px-4 py-2.5 rounded-full transition-all active:scale-95 duration-100"
            style={{
              touchAction: "manipulation",
              background: selectedCategory === cat ? "linear-gradient(135deg, var(--accent), var(--accent-dark))" : "var(--glass-bg)",
              color: selectedCategory === cat ? "white" : "var(--text-secondary)",
              border: "1px solid var(--glass-border)",
              boxShadow: selectedCategory === cat ? "0 2px 14px var(--accent-glow)" : "none",
            }}>
            {cat !== "すべて" ? `${CATEGORY_ICONS[cat as Category]} ` : "✦ "}{cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="glass p-16 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-base text-muted">記録が見つかりません</p>
          </motion.div>
        ) : (
          <motion.div key="grid" className="grid grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((entry, i) => (
              <motion.div key={entry.id} custom={i} variants={CARD} initial="hidden" animate="visible" layout>
                <Link href={`/entries/${entry.id}`}>
                  <div
                    className="glass overflow-hidden cursor-pointer h-full flex flex-col active:scale-[0.98] transition-transform duration-100"
                    style={{ boxShadow: "var(--card-shadow)", minHeight: 160 }}>
                    {entry.image_url ? (
                      <div className="relative overflow-hidden" style={{ height: 100 }}>
                        <img src={entry.image_url} alt="" className="w-full h-full object-cover opacity-92" />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.4))" }} />
                        <span className="absolute bottom-2 left-2 text-[9px] px-1.5 py-0.5 rounded-full text-white font-medium"
                          style={{ background: "rgba(0,0,0,0.40)" }}>
                          {CATEGORY_ICONS[entry.category]}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center"
                        style={{ height: 68, background: CAT_GRADIENTS[entry.category] ?? "linear-gradient(135deg, rgba(59,130,246,0.13) 0%, rgba(99,102,241,0.09) 100%)" }}>
                        <span className="text-3xl opacity-60">{CATEGORY_ICONS[entry.category]}</span>
                      </div>
                    )}
                    <div className="px-4 py-3 flex-1 flex flex-col">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-[13px] font-bold leading-none" style={{ color: "var(--accent)" }}>
                          {entry.category}
                        </span>
                        <span className="text-[11px] text-muted ml-auto whitespace-nowrap">{formatDate(entry.entry_date)}</span>
                      </div>
                      <p className="text-[13px] font-bold text-primary mb-1 leading-snug line-clamp-1">{entry.title}</p>
                      {entry.content && <p className="text-[11px] text-muted line-clamp-2 leading-relaxed flex-1 break-words">{entry.content}</p>}
                      <div className="flex items-center justify-end mt-2 pt-2"
                        style={{ borderTop: "1px solid var(--glass-border)" }}>
                        <span className="text-[11px] font-semibold text-accent flex items-center gap-0.5">
                          詳細 <ArrowRight className="w-2.5 h-2.5" strokeWidth={2.5} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
