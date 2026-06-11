"use client";

import { useState } from "react";
import Link from "next/link";
import { Entry, Category, CATEGORIES, CATEGORY_ICONS } from "@/lib/types";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", { month: "short", day: "numeric", weekday: "short" });
}

export function EntriesContent({ entries }: { entries: Entry[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "すべて">("すべて");

  const filtered = entries.filter((e) => {
    const matchCat = selectedCategory === "すべて" || e.category === selectedCategory;
    const matchSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.content?.toLowerCase() ?? "").includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="animate-fade-up relative z-10 py-4 lg:py-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-primary">記録一覧</h1>
          <p className="text-xs text-muted mt-1">{filtered.length}件の記録</p>
        </div>
        <Link href="/entries/new">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-sm font-medium shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="hidden sm:inline">新しい記録</span>
          </div>
        </Link>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="glass rounded-2xl flex items-center gap-3 px-4 py-3 shadow-lg shadow-black/20 flex-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-white/40 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="キーワードで検索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-primary placeholder:text-muted"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-white/40 hover:text-white/70">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
        {(["すべて", ...CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat as Category | "すべて")}
            className={`flex-shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full transition-all ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/30"
                : "glass text-secondary hover:text-primary"
            }`}
          >
            {cat !== "すべて" ? `${CATEGORY_ICONS[cat as Category]} ` : ""}{cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="glass rounded-3xl p-14 text-center shadow-xl shadow-black/20">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-sm text-muted">記録が見つかりません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((entry) => (
            <Link key={entry.id} href={`/entries/${entry.id}`}>
              <div className="glass rounded-2xl overflow-hidden shadow-xl shadow-black/20 active:scale-[0.98] hover:bg-white/10 transition-all duration-200 h-full flex flex-col">
                {entry.image_url && (
                  <img src={entry.image_url} alt="" className="w-full h-40 object-cover opacity-90" />
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-white/10 text-violet-300 border border-white/10">
                      {CATEGORY_ICONS[entry.category]} {entry.category}
                    </span>
                    <span className="text-[10px] text-muted ml-auto">{formatDate(entry.entry_date)}</span>
                  </div>
                  <p className="text-sm font-semibold text-primary">{entry.title}</p>
                  {entry.content && (
                    <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed flex-1">{entry.content}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
