"use client";

import Link from "next/link";
import { Entry, CATEGORY_ICONS } from "@/lib/types";

const MONTHS_JP = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

type GroupedEntries = { year: number; months: { month: number; entries: Entry[] }[] }[];

function groupByYearMonth(entries: Entry[]): GroupedEntries {
  const map = new Map<string, Entry[]>();
  for (const e of entries) {
    const [y, m] = e.entry_date.split("-");
    const key = `${y}-${m}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(e);
  }
  const years = new Map<number, Map<number, Entry[]>>();
  for (const [key, ents] of map) {
    const [y, m] = key.split("-").map(Number);
    if (!years.has(y)) years.set(y, new Map());
    years.get(y)!.set(m, ents);
  }
  return [...years.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, monthMap]) => ({
      year,
      months: [...monthMap.entries()].sort(([a], [b]) => b - a).map(([month, entries]) => ({ month, entries })),
    }));
}

export function TimelineContent({ entries }: { entries: Entry[] }) {
  const grouped = groupByYearMonth(entries);

  return (
    <div className="animate-fade-up relative z-10 py-4 lg:py-0">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-primary">人生年表</h1>
        <p className="text-xs text-muted mt-1">あなたの歩みを時系列で振り返る</p>
      </div>

      {grouped.length === 0 ? (
        <div className="glass rounded-3xl p-14 text-center shadow-xl shadow-black/20">
          <p className="text-5xl mb-4">✦</p>
          <p className="text-sm text-muted">まだ記録がありません</p>
          <Link href="/entries/new" className="inline-block mt-5 text-sm text-violet-400 font-medium hover:text-violet-300 transition-colors">
            最初の記録を追加 →
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {grouped.map(({ year, months }) => (
            <div key={year}>
              {/* Year marker */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-xl shadow-violet-700/40 flex-shrink-0">
                  <span className="text-white text-sm font-bold">{year}</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-violet-500/40 to-transparent" />
              </div>

              {months.map(({ month, entries: monthEntries }) => (
                <div key={month} className="ml-8 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0" />
                    <span className="text-xs font-semibold text-secondary">
                      {MONTHS_JP[month - 1]}
                      <span className="text-muted font-normal ml-1.5">({monthEntries.length}件)</span>
                    </span>
                    <div className="h-px flex-1 bg-white/6" />
                  </div>

                  <div className="ml-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {monthEntries.map((entry) => (
                      <Link key={entry.id} href={`/entries/${entry.id}`}>
                        <div className="glass rounded-2xl overflow-hidden shadow-xl shadow-black/20 active:scale-[0.98] hover:bg-white/10 transition-all duration-200 flex h-full">
                          <div className="w-1 bg-gradient-to-b from-violet-500/60 to-indigo-500/30 flex-shrink-0" />
                          <div className="flex-1 p-3">
                            <div className="flex items-start gap-3">
                              {entry.image_url && (
                                <img src={entry.image_url} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0 opacity-90" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-white/10 text-violet-300 border border-white/10">
                                    {CATEGORY_ICONS[entry.category]} {entry.category}
                                  </span>
                                  <span className="text-[9px] text-muted">{Number(entry.entry_date.split("-")[2])}日</span>
                                </div>
                                <p className="text-sm font-semibold text-primary leading-snug">{entry.title}</p>
                                {entry.content && (
                                  <p className="text-xs text-muted mt-0.5 line-clamp-2">{entry.content}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
