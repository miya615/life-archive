"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Entry, CATEGORY_ICONS } from "@/lib/types";

const MONTHS_JP = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

type Grouped = { year: number; months: { month: number; entries: Entry[] }[] }[];

function groupByYearMonth(entries: Entry[]): Grouped {
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
  return [...years.entries()].sort(([a], [b]) => b - a).map(([year, monthMap]) => ({
    year,
    months: [...monthMap.entries()].sort(([a], [b]) => b - a).map(([month, entries]) => ({ month, entries })),
  }));
}

export function TimelineContent({ entries }: { entries: Entry[] }) {
  const grouped = groupByYearMonth(entries);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-primary">人生年表</h1>
        <p className="text-xs text-muted mt-1">あなたの歩みを時系列で振り返る</p>
      </motion.div>

      {grouped.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-16 text-center">
          <p className="text-5xl mb-4">✦</p>
          <p className="text-sm text-muted">まだ記録がありません</p>
          <Link href="/entries/new">
            <motion.div whileHover={{ scale: 1.04 }} className="inline-block mt-5 text-sm text-accent font-medium">
              最初の記録を追加 →
            </motion.div>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-12">
          {grouped.map(({ year, months }, yi) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: yi * 0.1, duration: 0.5 }}
            >
              {/* Year header */}
              <div className="flex items-center gap-5 mb-8">
                <motion.div
                  whileHover={{ scale: 1.06, rotate: 3 }}
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl"
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                    boxShadow: "0 8px 32px var(--accent-glow)",
                  }}
                >
                  <span className="text-white text-sm lg:text-base font-bold">{year}</span>
                </motion.div>
                <div className="flex-1">
                  <div className="h-px" style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }} />
                  <p className="text-xs text-muted mt-1.5">
                    {months.reduce((acc, m) => acc + m.entries.length, 0)}件の記録
                  </p>
                </div>
              </div>

              {/* Months */}
              <div className="ml-8 lg:ml-12 space-y-8">
                {months.map(({ month, entries: me }, mi) => (
                  <motion.div
                    key={month}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: yi * 0.1 + mi * 0.06 }}
                  >
                    {/* Month label */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "var(--accent)" }} />
                      <span className="text-xs font-semibold text-secondary">
                        {MONTHS_JP[month - 1]}
                        <span className="text-muted font-normal ml-1.5">({me.length}件)</span>
                      </span>
                      <div className="h-px flex-1" style={{ background: "var(--glass-border)" }} />
                    </div>

                    {/* Entry cards grid */}
                    <div className="ml-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                      {me.map((entry, ei) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: yi * 0.1 + mi * 0.06 + ei * 0.04 }}
                        >
                          <Link href={`/entries/${entry.id}`}>
                            <motion.div
                              whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }}
                              className="glass overflow-hidden cursor-pointer flex h-full"
                              style={{ boxShadow: "var(--card-shadow)" }}
                            >
                              {/* Accent line */}
                              <div className="w-1 flex-shrink-0" style={{ background: "linear-gradient(to bottom, var(--accent), var(--accent-dark))" }} />
                              <div className="flex-1 p-3">
                                <div className="flex items-start gap-2">
                                  {entry.image_url && (
                                    <img src={entry.image_url} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0 opacity-90" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                                        style={{ background: "var(--glass-strong-bg)", color: "var(--accent)", border: "1px solid var(--glass-border)" }}>
                                        {CATEGORY_ICONS[entry.category]} {entry.category}
                                      </span>
                                      <span className="text-[9px] text-muted">{Number(entry.entry_date.split("-")[2])}日</span>
                                    </div>
                                    <p className="text-sm font-semibold text-primary leading-snug">{entry.title}</p>
                                    {entry.content && <p className="text-xs text-muted mt-0.5 line-clamp-2">{entry.content}</p>}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
