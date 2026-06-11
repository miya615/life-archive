"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X, ArrowRight, Image as ImageIcon } from "lucide-react";
import { Entry, Category, CATEGORIES, CATEGORY_ICONS } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", { month: "short", day: "numeric", weekday: "short" });
}

const CAT_GRADIENTS: Record<string, string> = {
  日常: "from-sky-700/40 to-blue-800/40", 健康: "from-emerald-700/40 to-teal-800/40",
  仕事: "from-indigo-700/40 to-violet-800/40", 学習: "from-violet-700/40 to-purple-800/40",
  お金: "from-amber-700/40 to-yellow-800/40", 人間関係: "from-rose-700/40 to-pink-800/40",
  アイデア: "from-orange-700/40 to-red-800/40", 思い出: "from-pink-700/40 to-rose-800/40",
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
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-semibold text-sm cursor-pointer"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", boxShadow: "0 4px 20px var(--accent-glow)" }}>
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">新しい記録</span>
          </motion.div>
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
          <motion.button key={cat}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
            onClick={() => setSelectedCategory(cat as Category | "すべて")}
            className="flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-full transition-all"
            style={{
              background: selectedCategory === cat ? "linear-gradient(135deg, var(--accent), var(--accent-dark))" : "var(--glass-bg)",
              color: selectedCategory === cat ? "white" : "var(--text-secondary)",
              border: "1px solid var(--glass-border)",
              boxShadow: selectedCategory === cat ? "0 2px 14px var(--accent-glow)" : "none",
            }}>
            {cat !== "すべて" ? `${CATEGORY_ICONS[cat as Category]} ` : "✦ "}{cat}
          </motion.button>
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
          <motion.div key="grid" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((entry, i) => (
              <motion.div key={entry.id} custom={i} variants={CARD} initial="hidden" animate="visible" layout>
                <Link href={`/entries/${entry.id}`}>
                  <motion.div whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.97 }}
                    className="glass overflow-hidden cursor-pointer h-full flex flex-col"
                    style={{ boxShadow: "var(--card-shadow)", minHeight: 220 }}>
                    {entry.image_url ? (
                      <div className="relative overflow-hidden" style={{ height: 160 }}>
                        <img src={entry.image_url} alt="" className="w-full h-full object-cover opacity-85" />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.5))" }} />
                        <span className="absolute bottom-2 left-3 text-[10px] px-2 py-0.5 rounded-full text-white font-medium"
                          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}>
                          <ImageIcon className="inline w-2.5 h-2.5 mr-1" />{entry.category}
                        </span>
                      </div>
                    ) : (
                      <div className={`flex items-center justify-center bg-gradient-to-br ${CAT_GRADIENTS[entry.category] ?? "from-violet-800/40 to-indigo-900/40"}`}
                        style={{ height: 100 }}>
                        <span className="text-4xl opacity-60">{CATEGORY_ICONS[entry.category]}</span>
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
                          style={{ background: "var(--glass-strong-bg)", color: "var(--accent)", border: "1px solid var(--glass-border)" }}>
                          {CATEGORY_ICONS[entry.category]} {entry.category}
                        </span>
                        <span className="text-xs text-muted ml-auto">{formatDate(entry.entry_date)}</span>
                      </div>
                      <p className="text-base font-bold text-primary mb-1.5">{entry.title}</p>
                      {entry.content && <p className="text-sm text-muted line-clamp-2 leading-relaxed flex-1">{entry.content}</p>}
                      <div className="flex items-center justify-end mt-3 pt-3"
                        style={{ borderTop: "1px solid var(--glass-border)" }}>
                        <span className="text-xs text-accent flex items-center gap-1">
                          詳細 <ArrowRight className="w-3 h-3" strokeWidth={2} />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
