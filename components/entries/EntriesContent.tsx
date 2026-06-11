"use client";

import { useState } from "react";
import Link from "next/link";
import { Entry, Category, CATEGORIES, CATEGORY_ICONS } from "@/lib/types";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
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
    <div className="py-8 space-y-5 animate-fade-up relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">記録一覧</h1>
        <Link href="/entries/new">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="glass rounded-2xl flex items-center gap-3 px-4 py-3 shadow-lg shadow-black/20">
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
          <button onClick={() => setSearch("")} className="text-white/40">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {(["すべて", ...CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat as Category | "すべて")}
            className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/30"
                : "glass text-secondary hover:text-primary"
            }`}
          >
            {cat !== "すべて" ? `${CATEGORY_ICONS[cat as Category]} ` : ""}{cat}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-xs text-muted">
        {filtered.length}件の記録
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center shadow-xl shadow-black/20">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-sm text-muted">記録が見つかりません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <Link key={entry.id} href={`/entries/${entry.id}`}>
              <div className="glass rounded-2xl overflow-hidden shadow-xl shadow-black/20 active:scale-[0.98] transition-transform">
                {entry.image_url && (
                  <img
                    src={entry.image_url}
                    alt=""
                    className="w-full h-36 object-cover opacity-90"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-white/10 text-violet-300 border border-white/10">
                      {CATEGORY_ICONS[entry.category]} {entry.category}
                    </span>
                    <span className="text-[10px] text-muted ml-auto">
                      {formatDate(entry.entry_date)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-primary">{entry.title}</p>
                  {entry.content && (
                    <p className="text-xs text-muted mt-1 line-clamp-2">{entry.content}</p>
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
