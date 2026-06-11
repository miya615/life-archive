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
  return (
    <div className="py-8 space-y-6 animate-fade-up relative z-10">
      {/* Header */}
      <div className="pt-2">
        <p className="text-xs text-muted font-medium tracking-wider mb-1">
          {todayJP()}
        </p>
        <h1 className="text-2xl font-bold text-primary leading-tight">
          おかえり、{displayName}さん
        </h1>
      </div>

      {/* Quick add card */}
      <Link href="/entries/new">
        <div className="glass-strong rounded-3xl p-5 shadow-2xl shadow-violet-900/30 group active:scale-[0.98] transition-transform">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">
                今日は何を残しますか？
              </p>
              <p className="text-xs text-muted mt-0.5">
                タップして新しい記録を追加
              </p>
            </div>
            <div className="ml-auto">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-white/30 group-active:text-white/60 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        </div>
      </Link>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-3xl p-5 shadow-xl shadow-black/20">
          <p className="text-xs text-muted mb-2">今月の記録</p>
          <p className="text-3xl font-bold text-primary">
            {monthCount}
            <span className="text-sm font-medium text-secondary ml-1">件</span>
          </p>
          <div className="mt-2 h-px bg-gradient-to-r from-violet-500/50 to-transparent" />
        </div>
        <Link href="/timeline">
          <div className="glass rounded-3xl p-5 shadow-xl shadow-black/20 h-full flex flex-col justify-between active:scale-95 transition-transform">
            <p className="text-xs text-muted">人生年表</p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-sm font-semibold text-primary">振り返る</p>
              <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-violet-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent entries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-secondary">最近の記録</h2>
          <Link
            href="/entries"
            className="text-xs text-violet-400 font-medium flex items-center gap-1"
          >
            すべて見る
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>

        {entries.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center shadow-xl shadow-black/20">
            <p className="text-4xl mb-3">✦</p>
            <p className="text-sm text-muted">
              まだ記録がありません
              <br />
              最初の記録を残してみましょう
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, i) => (
              <Link key={entry.id} href={`/entries/${entry.id}`}>
                <div
                  className="glass rounded-2xl p-4 shadow-xl shadow-black/20 active:scale-[0.98] transition-transform"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start gap-3">
                    {entry.image_url && (
                      <img
                        src={entry.image_url}
                        alt=""
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0 opacity-90"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-white/10 text-violet-300 border border-white/10">
                          {CATEGORY_ICONS[entry.category]} {entry.category}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-primary truncate">
                        {entry.title}
                      </p>
                      {entry.content && (
                        <p className="text-xs text-muted mt-0.5 line-clamp-2">
                          {entry.content}
                        </p>
                      )}
                      <p className="text-[10px] text-muted mt-1.5">
                        {formatDate(entry.entry_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
