"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X } from "lucide-react";
import { Entry, Category, CATEGORIES, CATEGORY_ICONS } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", { month: "short", day: "numeric", weekday: "short" });
}

const CARD = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  visible: (i: number) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.04, duration: 0.35 } }),
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
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-primary">記録一覧</h1>
          <p className="text-xs text-muted mt-1">{filtered.length}件の記録</p>
        </div>
        <Link href="/entries/new">
          <motion.div
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white text-sm font-medium"
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
              boxShadow: "0 4px 16px var(--accent-glow)",
            }}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">新しい記録</span>
          </motion.div>
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="glass flex items-center gap-3 px-4 py-3"
      >
        <Search className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} strokeWidth={1.8} />
        <input
          type="text" placeholder="キーワードで検索..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-primary placeholder:text-muted"
        />
        <AnimatePresence>
          {search && (
            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSearch("")}
              style={{ color: "var(--text-muted)" }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {(["すべて", ...CATEGORIES] as const).map((cat, i) => (
          <motion.button
            key={cat}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(cat as Category | "すべて")}
            className="flex-shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full transition-all"
            style={{
              background: selectedCategory === cat ? "linear-gradient(135deg, var(--accent), var(--accent-dark))" : "var(--glass-bg)",
              color: selectedCategory === cat ? "white" : "var(--text-secondary)",
              border: "1px solid var(--glass-border)",
              boxShadow: selectedCategory === cat ? "0 2px 12px var(--accent-glow)" : "none",
            }}
          >
            {cat !== "すべて" ? `${CATEGORY_ICONS[cat as Category]} ` : "✦ "}{cat}
          </motion.button>
        ))}
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="glass p-16 text-center"
          >
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-sm text-muted">記録が見つかりません</p>
          </motion.div>
        ) : (
          <motion.div key="grid" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((entry, i) => (
              <motion.div key={entry.id} custom={i} variants={CARD} initial="hidden" animate="visible" layout>
                <Link href={`/entries/${entry.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -3 }} whileTap={{ scale: 0.97 }}
                    className="glass overflow-hidden cursor-pointer h-full flex flex-col"
                    style={{ boxShadow: "var(--card-shadow)" }}
                  >
                    {entry.image_url && (
                      <div className="relative overflow-hidden h-36">
                        <img src={entry.image_url} alt="" className="w-full h-full object-cover opacity-85" />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5))" }} />
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
                      <p className="text-sm font-semibold text-primary">{entry.title}</p>
                      {entry.content && <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed flex-1">{entry.content}</p>}
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
