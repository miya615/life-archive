"use client";

import Link from "next/link";
import { Entry, CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/types";

const MONTHS_JP = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

type GroupedEntries = {
  year: number;
  months: {
    month: number;
    entries: Entry[];
  }[];
}[];

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
      months: [...monthMap.entries()]
        .sort(([a], [b]) => b - a)
        .map(([month, entries]) => ({ month, entries })),
    }));
}

export function TimelineContent({ entries }: { entries: Entry[] }) {
  const grouped = groupByYearMonth(entries);

  return (
    <div className="py-8 animate-fade-up">
      <h1 className="text-xl font-bold text-gray-800 mb-6">人生年表</h1>

      {grouped.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center shadow-md shadow-indigo-100/30">
          <p className="text-4xl mb-3">✦</p>
          <p className="text-sm text-gray-500">まだ記録がありません</p>
          <Link href="/entries/new" className="inline-block mt-4 text-sm text-indigo-500 font-medium">
            最初の記録を追加 →
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ year, months }) => (
            <div key={year}>
              {/* Year marker */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center shadow-md shadow-indigo-200 flex-shrink-0">
                  <span className="text-white text-xs font-bold leading-tight text-center">{year}</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-indigo-200 to-transparent" />
              </div>

              {months.map(({ month, entries: monthEntries }) => (
                <div key={month} className="ml-6 mb-6">
                  {/* Month */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    <span className="text-xs font-semibold text-gray-500">
                      {MONTHS_JP[month - 1]}
                      <span className="text-gray-400 font-normal ml-1">({monthEntries.length}件)</span>
                    </span>
                  </div>

                  {/* Entries */}
                  <div className="ml-4 space-y-3">
                    {monthEntries.map((entry) => (
                      <Link key={entry.id} href={`/entries/${entry.id}`}>
                        <div className="glass rounded-2xl overflow-hidden shadow-md shadow-indigo-100/30 active:scale-[0.98] transition-transform flex gap-0">
                          {/* Timeline line */}
                          <div className="w-1 bg-gradient-to-b from-indigo-200 to-purple-100 flex-shrink-0" />
                          <div className="flex-1 p-3">
                            <div className="flex items-start gap-3">
                              {entry.image_url && (
                                <img
                                  src={entry.image_url}
                                  alt=""
                                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[entry.category]}`}>
                                    {CATEGORY_ICONS[entry.category]} {entry.category}
                                  </span>
                                  <span className="text-[9px] text-gray-400">
                                    {Number(entry.entry_date.split("-")[2])}日
                                  </span>
                                </div>
                                <p className="text-sm font-semibold text-gray-800 leading-snug">{entry.title}</p>
                                {entry.content && (
                                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{entry.content}</p>
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
