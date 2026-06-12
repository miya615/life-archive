"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Search, SlidersHorizontal, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, CATEGORY_ICONS, CARD_STYLES, type Category, type Entry } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const ALL_CATS = ["すべて", ...CATEGORIES] as const;

const CARD = {
  hidden:  { opacity: 0, y: 8, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: Math.min(i * 0.02, 0.10), duration: 0.14, ease: "easeOut" as const },
  }),
};

/* ── サブコンポーネント ── */

function RecordGridSkeleton() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="rounded-[20px] bg-slate-100 animate-pulse" style={{ height: 160 }} />
      ))}
    </div>
  );
}

function RecordGrid({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return (
      <div className="glass p-16 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <p className="text-base text-muted">記録が見つかりません</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
      {entries.map((entry, i) => {
        const cs = CARD_STYLES[entry.category] ?? CARD_STYLES["日常"];
        return (
          <motion.div key={entry.id} custom={i} variants={CARD} initial="hidden" animate="visible">
            <Link href={`/entries/${entry.id}`}>
              <div
                className="overflow-hidden cursor-pointer flex flex-col active:scale-[0.98] transition-transform duration-100 rounded-[20px]"
                style={{ background: cs.bg, border: `1px solid ${cs.borderColor}`, boxShadow: "var(--card-shadow)", height: 160, touchAction: "manipulation" }}>
                {entry.image_url ? (
                  <div className="w-full shrink-0 overflow-hidden" style={{ height: 88 }}>
                    <img src={entry.image_url} alt="" className="h-full w-full object-cover object-center" />
                  </div>
                ) : (
                  <div className="flex w-full shrink-0 items-center justify-center" style={{ height: 88, background: `${cs.accent}22` }}>
                    <span className="text-3xl" style={{ opacity: 0.7 }}>{CATEGORY_ICONS[entry.category]}</span>
                  </div>
                )}
                <div className="flex min-h-0 flex-1 flex-col justify-start gap-1 px-3.5 pt-2 pb-2.5 overflow-hidden">
                  <div className="flex min-w-0 items-center gap-1">
                    <span className="shrink-0 text-[11px] font-bold leading-tight" style={{ color: cs.labelColor }}>
                      {entry.category}
                    </span>
                    <span className="min-w-0 truncate text-[10px] leading-tight text-slate-400 ml-auto">{formatDate(entry.entry_date)}</span>
                  </div>
                  <p className="block min-w-0 overflow-hidden break-words text-[13px] font-bold leading-snug line-clamp-2" style={{ color: "#0F172A" }}>{entry.title}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

interface SearchAndCategoryAreaProps {
  search: string;
  onSearch: (v: string) => void;
  selectedCategory: Category | "すべて";
  onSelectCategory: (c: Category | "すべて") => void;
}

function SearchAndCategoryArea({ search, onSearch, selectedCategory, onSelectCategory }: SearchAndCategoryAreaProps) {
  const [catOpen, setCatOpen] = useState(false);
  const isFiltered = selectedCategory !== "すべて";

  return (
    <div>
      {/* 検索欄 + カテゴリフィルターを横並び */}
      <div className="flex items-center gap-2">
        {/* カテゴリフィルターボタン（左） */}
        <button
          type="button"
          onClick={() => setCatOpen((v) => !v)}
          aria-label="カテゴリフィルター"
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-all duration-100 active:scale-95"
          style={{
            touchAction: "manipulation",
            background: catOpen || isFiltered
              ? "linear-gradient(135deg, var(--accent), var(--accent-dark))"
              : "white",
            color: catOpen || isFiltered ? "white" : "var(--text-secondary)",
            border: catOpen || isFiltered ? "none" : "1px solid var(--glass-border)",
            boxShadow: catOpen || isFiltered
              ? "0 4px 16px var(--accent-glow)"
              : "0 1px 4px rgba(0,0,0,0.06)",
            maxWidth: 140,
          }}
        >
          <SlidersHorizontal className="w-4 h-4 shrink-0" strokeWidth={2} />
          <span className="truncate">
            {isFiltered ? selectedCategory : "すべて"}
          </span>
        </button>

        {/* 検索欄（右、flex-1） */}
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-muted)", left: 12 }}
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="タイトル・本文で検索"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="h-11 w-full rounded-full bg-white border pr-9 text-[13px] font-medium text-primary placeholder:text-muted outline-none"
            style={{ borderColor: "var(--glass-border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", paddingLeft: 36 }}
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)", touchAction: "manipulation" }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* カテゴリ選択パネル */}
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
                    onClick={() => { onSelectCategory(cat as Category | "すべて"); setCatOpen(false); }}
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

      {/* フィルター中バッジ */}
      {!catOpen && isFiltered && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-[12px] text-muted">フィルター中:</span>
          <span
            className="inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: "var(--glass-strong-bg)", color: "var(--accent)" }}
          >
            {CATEGORY_ICONS[selectedCategory as Category]} {selectedCategory}
            <button
              type="button"
              onClick={() => onSelectCategory("すべて")}
              className="ml-0.5"
              style={{ touchAction: "manipulation" }}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        </div>
      )}
    </div>
  );
}

/* ── メインコンポーネント ── */

export function EntriesContent() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "すべて">("すべて");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { if (mounted) setEntries([]); return; }
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
      <div>
        <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-primary">記録一覧</h1>
        <p className="text-sm text-muted mt-1">
          {loading ? "読み込み中..." : `${filtered.length}件の記録`}
        </p>
      </div>

      <SearchAndCategoryArea
        search={search}
        onSearch={setSearch}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {loading ? (
        <RecordGridSkeleton />
      ) : (
        <RecordGrid entries={filtered} />
      )}
    </div>
  );
}
