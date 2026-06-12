"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, CATEGORY_ICONS, type Category, type Entry } from "@/lib/types";
import { CAT_GRADIENTS, formatDate } from "@/lib/utils";

const ALL_CATS = ["すべて", ...CATEGORIES] as const;

const CARD = {
  hidden:  { opacity: 0, y: 8, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: Math.min(i * 0.02, 0.08), duration: 0.14, ease: "easeOut" as const },
  }),
};

/** カードグリッドのスケルトン（データ取得中に即時表示） */
function CardSkeleton() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="rounded-[20px] bg-slate-100 animate-pulse" style={{ height: 160 }} />
      ))}
    </div>
  );
}

export function EntriesContent() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "すべて">("すべて");
  const [catOpen, setCatOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { if (mounted) { setEntries([]); } return; }
        const { data } = await supabase
          .from("entries").select("*")
          .eq("user_id", user.id)
          .order("entry_date", { ascending: false });
        if (mounted) setEntries(data ?? []);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => entries.filter((e) => {
    const matchCat = selectedCategory === "すべて" || e.category === selectedCategory;
    const matchSearch = !search
      || e.title.toLowerCase().includes(search.toLowerCase())
      || (e.content?.toLowerCase() ?? "").includes(search.toLowerCase());
    return matchCat && matchSearch;
  }), [entries, search, selectedCategory]);

  return (
    <div className="space-y-5 lg:space-y-7">

      {/* ── Header（データ待ちなし・即時表示） ── */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-primary">記録一覧</h1>
          <p className="text-sm text-muted mt-1">
            {loading ? "読み込み中..." : `${filtered.length}件の記録`}
          </p>
        </div>
        <Link
          href="/entries/new"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-semibold text-sm active:scale-95 transition-transform duration-100"
          style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", boxShadow: "0 4px 20px var(--accent-glow)", touchAction: "manipulation" }}>
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">新しい記録</span>
        </Link>
      </div>

      {/* ── 検索 + フィルターボタン（即時表示） ── */}
      <div>
        <div className="flex items-center gap-3">
          {/* アイコン left-4、テキスト pl-14 で重ならない */}
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: "var(--text-muted)" }}
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="タイトル・本文で検索"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-full bg-white border pl-14 pr-10 text-base font-medium text-primary placeholder:text-muted outline-none"
              style={{ borderColor: "var(--glass-border)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)", touchAction: "manipulation" }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* フィルターボタン */}
          <button
            type="button"
            onClick={() => setCatOpen((v) => !v)}
            aria-label="カテゴリフィルター"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform duration-100 active:scale-95"
            style={{
              touchAction: "manipulation",
              background: catOpen || selectedCategory !== "すべて"
                ? "linear-gradient(135deg, var(--accent), var(--accent-dark))"
                : "white",
              color: catOpen || selectedCategory !== "すべて" ? "white" : "var(--text-secondary)",
              border: catOpen || selectedCategory !== "すべて" ? "none" : "1px solid var(--glass-border)",
              boxShadow: catOpen || selectedCategory !== "すべて"
                ? "0 4px 16px var(--accent-glow)"
                : "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <SlidersHorizontal className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* カテゴリアコーディオン */}
        <AnimatePresence initial={false}>
          {catOpen && (
            <motion.div
              key="cat-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div
                className="mt-3 overflow-hidden rounded-[20px] bg-white"
                style={{ border: "1px solid var(--glass-border)", boxShadow: "0 8px 28px rgba(15,23,42,0.08)" }}
              >
                {ALL_CATS.map((cat, i) => {
                  const active = selectedCategory === cat;
                  const isLast = i === ALL_CATS.length - 1;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => { setSelectedCategory(cat as Category | "すべて"); setCatOpen(false); }}
                      className="flex min-h-[52px] w-full items-center gap-3 px-4 text-left text-[15px] font-bold transition-colors duration-100 active:bg-slate-50"
                      style={{
                        borderBottom: isLast ? "none" : "1px solid var(--glass-border)",
                        background: active ? "var(--glass-strong-bg)" : "transparent",
                        color: active ? "var(--accent)" : "var(--text-secondary)",
                        touchAction: "manipulation",
                      }}
                    >
                      <span className="text-xl w-7 text-center flex-shrink-0">
                        {cat === "すべて" ? "✦" : CATEGORY_ICONS[cat as Category]}
                      </span>
                      <span className="flex-1">{cat}</span>
                      {active && <Check className="w-5 h-5 flex-shrink-0" style={{ color: "var(--accent)" }} />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* アクティブカテゴリバッジ */}
        {!catOpen && selectedCategory !== "すべて" && (
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-[12px] text-muted">フィルター中:</span>
            <span
              className="inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "var(--glass-strong-bg)", color: "var(--accent)" }}
            >
              {CATEGORY_ICONS[selectedCategory as Category]} {selectedCategory}
              <button
                type="button"
                onClick={() => setSelectedCategory("すべて")}
                className="ml-0.5"
                style={{ touchAction: "manipulation" }}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* ── カードグリッド or スケルトン ── */}
      {loading ? (
        <CardSkeleton />
      ) : filtered.length === 0 ? (
        <div className="glass p-16 text-center">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-base text-muted">記録が見つかりません</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((entry, i) => (
            <motion.div key={entry.id} custom={i} variants={CARD} initial="hidden" animate="visible">
              <Link href={`/entries/${entry.id}`}>
                <div
                  className="glass overflow-hidden cursor-pointer h-full flex flex-col active:scale-[0.98] transition-transform duration-100"
                  style={{ boxShadow: "var(--card-shadow)", minHeight: 160, touchAction: "manipulation" }}>
                  {entry.image_url ? (
                    <div className="relative overflow-hidden" style={{ height: 100 }}>
                      <img src={entry.image_url} alt="" className="w-full h-full object-cover" style={{ opacity: 0.92 }} />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.4))" }} />
                      <span className="absolute bottom-2 left-2 text-[9px] px-1.5 py-0.5 rounded-full text-white font-medium"
                        style={{ background: "rgba(0,0,0,0.40)" }}>
                        {CATEGORY_ICONS[entry.category]}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center"
                      style={{ height: 68, background: CAT_GRADIENTS[entry.category] ?? CAT_GRADIENTS["日常"] }}>
                      <span className="text-3xl" style={{ opacity: 0.6 }}>{CATEGORY_ICONS[entry.category]}</span>
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
                    {entry.content && (
                      <p className="text-[11px] text-muted line-clamp-2 leading-relaxed flex-1 break-words">{entry.content}</p>
                    )}
                    <div className="flex items-center justify-end mt-2 pt-2"
                      style={{ borderTop: "1px solid var(--glass-border)" }}>
                      <span className="text-[11px] font-semibold flex items-center gap-0.5" style={{ color: "var(--accent)" }}>
                        詳細 <ArrowRight className="w-2.5 h-2.5" strokeWidth={2.5} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
