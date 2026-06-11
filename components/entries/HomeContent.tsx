"use client";

import Link from "next/link";
import { Entry, CATEGORY_ICONS } from "@/lib/types";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

function todayJP() {
  return new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

interface Props {
  entries: Entry[];
  monthCount: number;
  displayName: string;
}

export function HomeContent({ entries, monthCount, displayName }: Props) {
  const totalEntries = entries.length;

  return (
    <div className="animate-fade-up relative z-10 py-4 lg:py-0">
      {/* Page heading */}
      <div className="mb-6 lg:mb-8">
        <p className="text-xs text-muted font-medium tracking-wider mb-1">{todayJP()}</p>
        <h1 className="text-2xl lg:text-3xl font-bold text-primary leading-tight">
          おかえり、{displayName}さん
        </h1>
      </div>

      {/* 2-column layout on desktop */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

        {/* ── Left column ── */}
        <div className="flex flex-col gap-5 lg:w-80 xl:w-96 flex-shrink-0">

          {/* Quick add */}
          <Link href="/entries/new" className="block">
            <div className="glass-strong rounded-3xl p-5 shadow-2xl shadow-violet-900/30 group active:scale-[0.98] hover:shadow-violet-800/40 transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-primary">今日は何を残しますか？</p>
                  <p className="text-xs text-muted mt-0.5">タップして新しい記録を追加</p>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-white/25 group-hover:text-white/50 transition-colors flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass rounded-3xl p-5 shadow-xl shadow-black/20">
              <p className="text-xs text-muted mb-2">今月の記録</p>
              <p className="text-3xl font-bold text-primary leading-none">
                {monthCount}
              </p>
              <p className="text-xs text-secondary mt-1">件</p>
              <div className="mt-3 h-px bg-gradient-to-r from-violet-500/50 to-transparent" />
            </div>
            <div className="glass rounded-3xl p-5 shadow-xl shadow-black/20">
              <p className="text-xs text-muted mb-2">総記録数</p>
              <p className="text-3xl font-bold text-primary leading-none">
                {totalEntries}
              </p>
              <p className="text-xs text-secondary mt-1">件</p>
              <div className="mt-3 h-px bg-gradient-to-r from-indigo-500/50 to-transparent" />
            </div>
          </div>

          {/* Timeline shortcut */}
          <Link href="/timeline" className="block">
            <div className="glass rounded-3xl p-5 shadow-xl shadow-black/20 active:scale-[0.98] hover:bg-white/10 transition-all duration-200 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted mb-1">人生年表</p>
                  <p className="text-sm font-semibold text-primary">過去を振り返る</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-400/20 flex items-center justify-center group-hover:from-violet-600/50 group-hover:to-indigo-600/50 transition-all">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-violet-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex gap-1">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-1 rounded-full"
                    style={{
                      background: `rgba(139,92,246,${0.15 + i * 0.12})`,
                    }}
                  />
                ))}
              </div>
            </div>
          </Link>
        </div>

        {/* ── Right column ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Recent entries header */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-secondary">最近の記録</h2>
            <Link href="/entries" className="text-xs text-violet-400 font-medium flex items-center gap-1 hover:text-violet-300 transition-colors">
              すべて見る
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>

          {entries.length === 0 ? (
            <div className="glass rounded-3xl p-12 text-center shadow-xl shadow-black/20 flex-1 flex flex-col items-center justify-center">
              <p className="text-5xl mb-4">✦</p>
              <p className="text-sm text-muted leading-relaxed">
                まだ記録がありません<br />最初の記録を残してみましょう
              </p>
              <Link href="/entries/new">
                <div className="mt-6 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600/60 to-indigo-600/60 border border-violet-400/20 text-sm font-medium text-violet-300">
                  記録を追加する
                </div>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
              {entries.map((entry, i) => (
                <Link key={entry.id} href={`/entries/${entry.id}`}>
                  <div
                    className="glass rounded-2xl overflow-hidden shadow-xl shadow-black/20 active:scale-[0.98] hover:bg-white/10 transition-all duration-200 h-full"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {entry.image_url && (
                      <img
                        src={entry.image_url}
                        alt=""
                        className="w-full h-36 object-cover opacity-85"
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
                      <p className="text-sm font-semibold text-primary leading-snug">
                        {entry.title}
                      </p>
                      {entry.content && (
                        <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed">
                          {entry.content}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Explore entries CTA */}
          {entries.length > 0 && (
            <Link href="/entries" className="block">
              <div className="glass rounded-2xl p-4 shadow-xl shadow-black/20 hover:bg-white/10 transition-all duration-200 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/8 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-violet-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-secondary">記録を探す</p>
                      <p className="text-[10px] text-muted">キーワード・カテゴリで検索</p>
                    </div>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-white/25 group-hover:text-white/50 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
