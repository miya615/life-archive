"use client";

import Link from "next/link";
import { Entry, CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/types";

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
    <div className="py-8 space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <p className="text-xs text-gray-400 font-medium tracking-wider uppercase mb-1">
          {todayJP()}
        </p>
        <h1 className="text-2xl font-bold text-gray-800 leading-tight">
          おかえり、{displayName}さん
        </h1>
      </div>

      {/* Quick add card */}
      <Link href="/entries/new">
        <div className="glass rounded-3xl p-5 shadow-lg shadow-indigo-100/40 border border-white/60 group active:scale-[0.98] transition-transform">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-200">
              <span className="text-white text-lg">+</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                今日は何を残しますか？
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                タップして新しい記録を追加
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-3xl p-4 shadow-md shadow-indigo-100/30">
          <p className="text-xs text-gray-400 mb-1">今月の記録</p>
          <p className="text-3xl font-bold text-gray-800">
            {monthCount}
            <span className="text-sm font-medium text-gray-400 ml-1">件</span>
          </p>
        </div>
        <Link href="/timeline">
          <div className="glass rounded-3xl p-4 shadow-md shadow-indigo-100/30 h-full flex flex-col justify-between active:scale-95 transition-transform">
            <p className="text-xs text-gray-400">人生年表</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm font-semibold text-gray-700">振り返る</p>
              <span className="text-indigo-400 text-lg">→</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent entries */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-600">最近の記録</h2>
          <Link
            href="/entries"
            className="text-xs text-indigo-500 font-medium"
          >
            すべて見る
          </Link>
        </div>

        {entries.length === 0 ? (
          <div className="glass rounded-3xl p-8 text-center shadow-md shadow-indigo-100/30">
            <p className="text-4xl mb-3">✦</p>
            <p className="text-sm text-gray-500">
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
                  className="glass rounded-2xl p-4 shadow-md shadow-indigo-100/30 active:scale-[0.98] transition-transform"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start gap-3">
                    {entry.image_url && (
                      <img
                        src={entry.image_url}
                        alt=""
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            CATEGORY_COLORS[entry.category]
                          }`}
                        >
                          {CATEGORY_ICONS[entry.category]} {entry.category}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {entry.title}
                      </p>
                      {entry.content && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {entry.content}
                        </p>
                      )}
                      <p className="text-[10px] text-gray-400 mt-1.5">
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
