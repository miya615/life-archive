"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, ArrowRight } from "lucide-react";
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
  return [...years.entries()].sort(([a],[b])=>b-a).map(([year,monthMap])=>({
    year,
    months: [...monthMap.entries()].sort(([a],[b])=>b-a).map(([month,entries])=>({ month, entries })),
  }));
}

export function TimelineContent({ entries }: { entries: Entry[] }) {
  const grouped = groupByYearMonth(entries);

  return (
    <div className="space-y-6 lg:space-y-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-primary">人生年表</h1>
        <p className="text-sm text-muted mt-1">あなたの歩みを時系列で振り返る</p>
      </motion.div>

      {grouped.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-16 text-center">
          <p className="text-5xl mb-4">✦</p>
          <p className="text-base text-muted mb-6">まだ記録がありません</p>
          <Link href="/entries/new">
            <div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm font-semibold cursor-pointer active:scale-95 transition-transform duration-100"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", boxShadow: "0 4px 20px var(--accent-glow)", touchAction: "manipulation" }}>
              <Plus className="w-4 h-4" /> 最初の記録を追加
            </div>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-14">
          {grouped.map(({ year, months }, yi) => (
            <motion.div key={year}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: yi * 0.1, duration: 0.5 }}>
              {/* Year header */}
              <div className="flex items-center gap-5 mb-8">
                <div
                  className="rounded-3xl flex items-center justify-center flex-shrink-0"
                  style={{ width: 64, height: 64, background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", boxShadow: "0 6px 24px var(--accent-glow)" }}>
                  <span className="text-white text-base font-bold">{year}</span>
                </div>
                <div className="flex-1">
                  <div className="h-px" style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }} />
                  <p className="text-xs text-muted mt-1.5">
                    {months.reduce((acc,m)=>acc+m.entries.length,0)}件の記録
                  </p>
                </div>
              </div>

              <div className="ml-10 lg:ml-14 space-y-8">
                {months.map(({ month, entries: me }, mi) => (
                  <motion.div key={month}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: yi * 0.1 + mi * 0.06 }}>
                    {/* Month label */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "var(--accent)" }} />
                      <span className="text-sm font-bold text-secondary">
                        {MONTHS_JP[month-1]}
                        <span className="text-muted font-normal ml-2 text-xs">（{me.length}件）</span>
                      </span>
                      <div className="h-px flex-1" style={{ background: "var(--glass-border)" }} />
                    </div>

                    <div className="ml-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {me.map((entry, ei) => (
                        <motion.div key={entry.id}
                          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: yi*0.1 + mi*0.06 + ei*0.04 }}>
                          <Link href={`/entries/${entry.id}`}>
                            <div
                              className="glass overflow-hidden cursor-pointer flex h-full active:scale-[0.98] transition-transform duration-100"
                              style={{ boxShadow: "var(--card-shadow)", minHeight: 80 }}>
                              <div className="w-1.5 flex-shrink-0" style={{ background: "linear-gradient(to bottom, var(--accent), var(--accent-dark))" }} />
                              <div className="flex-1 p-4">
                                <div className="flex items-start gap-3">
                                  {entry.image_url ? (
                                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                                      <img src={entry.image_url} alt="" className="w-full h-full object-cover opacity-90" />
                                    </div>
                                  ) : (
                                    <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center"
                                      style={{ background: "var(--glass-strong-bg)" }}>
                                      <span className="text-2xl">{CATEGORY_ICONS[entry.category]}</span>
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                                        style={{ background: "var(--glass-strong-bg)", color: "var(--accent)", border: "1px solid var(--glass-border)" }}>
                                        {CATEGORY_ICONS[entry.category]} {entry.category}
                                      </span>
                                      <span className="text-[10px] text-muted">{Number(entry.entry_date.split("-")[2])}日</span>
                                    </div>
                                    <p className="text-sm font-bold text-primary leading-snug">{entry.title}</p>
                                    {entry.content && <p className="text-xs text-muted mt-0.5 line-clamp-2 leading-relaxed">{entry.content}</p>}
                                    <div className="flex items-center gap-1 mt-2">
                                      <span className="text-[10px] text-accent flex items-center gap-0.5">詳細 <ArrowRight className="w-2.5 h-2.5" /></span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
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
