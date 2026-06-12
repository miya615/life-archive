"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X, ArrowRight } from "lucide-react";
import { Entry, Category, CATEGORIES, CATEGORY_ICONS } from "@/lib/types";
import { formatDate, CAT_GRADIENTS } from "@/lib/utils";

const CARD = {
  hidden:  { opacity: 0, y: 12, scale: 0.97 },
  visible: (i: number) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: Math.min(i * 0.025, 0.12), duration: 0.18, ease: "easeOut" as const } }),
};

export function EntriesContent({ entries }: { entries: Entry[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "すべて">("すべて");

  const filtered = useMemo(() => entries.filter((e) => {
    const matchCat = selectedCategory === "すべて" || e.category === selectedCategory;
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || (e.content?.toLowerCase() ?? "").includes(search.toLowerCase());
    return matchCat && matchSearch;
  }), [entries, search, selectedCategory]);

  return (
    <div className="space-y-5 lg:space-y-7">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-primary">記録一覧</h1>
          <p className="text-sm text-muted mt-1">{filtered.length}件の記録</p>
        </div>
        <Link
          href="/entries/new"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-semibold text-sm active:scale-95 transition-transform duration-100"
          style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", boxShadow: "0 4px 20px var(--accent-glow)", touchAction: "manipulation" }}>
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">新しい記録</span>
        </Link>
      </motion.div>

      {/* Search — 幅を抑えて高さを確保 */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
        <div className="relative w-[92%] max-w-[400px]">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" strokeWidth={1.8} />
          <input
            type="text"
            placeholder="タイトル・本文で検索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-full bg-white border pl-11 pr-11 text-base font-medium text-primary placeholder:text-muted outline-none"
            style={{
              borderColor: "var(--glass-border)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
                style={{ touchAction: "manipulation" }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Category filter — 44px タップターゲット */}
      <div className="-mx-4 overflow-x-auto px-4 pb-1 scrollbar-hide">
        <div className="flex w-max items-center gap-2.5">
          {(["すべて", ...CATEGORIES] as const).map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat as Category | "すべて")}
                className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full px-4 py-2.5 text-[15px] font-bold transition-transform duration-100 active:scale-95"
                style={{
                  touchAction: "manipulation",
                  background: active ? "linear-gradient(135deg, var(--accent), var(--accent-dark))" : "white",
                  color: active ? "white" : "var(--text-secondary)",
                  border: active ? "none" : "1px solid var(--glass-border)",
                  boxShadow: active ? "0 4px 16px var(--accent-glow)" : "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                {cat !== "すべて" ? `${CATEGORY_ICONS[cat as Category]} ` : "✦ "}{cat}
              </button>
            );
          })}
        </div>
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
              <motion.div key={entry.id} custom={i} variants={CARD} initial="hidden" animate="visible">
                <Link href={`/entries/${entry.id}`}>
                  <div
                    className="glass overflow-hidden cursor-pointer h-full flex flex-col active:scale-[0.98] transition-transform duration-100"
                    style={{ boxShadow: "var(--card-shadow)", minHeight: 160, touchAction: "manipulation" }}>
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
