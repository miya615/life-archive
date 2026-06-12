"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { type Entry, CATEGORY_ICONS, CARD_STYLES } from "@/lib/types";

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

function TimelineSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      {[0, 1].map((i) => (
        <div key={i} className="space-y-4">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex-shrink-0" />
            <div className="flex-1 h-px bg-slate-100" />
          </div>
          <div className="ml-10 grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((j) => (
              <div key={j} className="h-24 rounded-[20px] bg-slate-100" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TimelineContent() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

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

  const grouped = groupByYearMonth(entries);

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-primary">人生年表</h1>
        <p className="text-sm text-muted mt-1">あなたの歩みを時系列で振り返る</p>
      </div>

      {loading ? (
        <TimelineSkeleton />
      ) : grouped.length === 0 ? (
        <div className="glass p-16 text-center">
          <p className="text-5xl mb-4">✦</p>
          <p className="text-base text-muted mb-6">まだ記録がありません</p>
          <Link href="/entries/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm font-semibold active:scale-95 transition-transform duration-100"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", boxShadow: "0 4px 20px var(--accent-glow)", touchAction: "manipulation" }}>
            <Plus className="w-4 h-4" /> 最初の記録を追加
          </Link>
        </div>
      ) : (
        <div className="space-y-14">
          {grouped.map(({ year, months }) => (
            <motion.div key={year}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.14 }}>
              <div className="flex items-center gap-5 mb-8">
                <div
                  className="rounded-3xl flex items-center justify-center flex-shrink-0"
                  style={{ width: 64, height: 64, background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", boxShadow: "0 6px 24px var(--accent-glow)" }}>
                  <span className="text-white text-base font-bold">{year}</span>
                </div>
                <div className="flex-1">
                  <div className="h-px" style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }} />
                  <p className="text-xs text-muted mt-1.5">
                    {months.reduce((acc, m) => acc + m.entries.length, 0)}件の記録
                  </p>
                </div>
              </div>

              <div className="ml-10 lg:ml-14 space-y-8">
                {months.map(({ month, entries: me }) => (
                  <div key={month}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "var(--accent)" }} />
                      <span className="text-sm font-bold text-secondary">
                        {MONTHS_JP[month - 1]}
                        <span className="text-muted font-normal ml-2 text-xs">（{me.length}件）</span>
                      </span>
                      <div className="h-px flex-1" style={{ background: "var(--glass-border)" }} />
                    </div>

                    <div className="ml-6 grid grid-cols-2 xl:grid-cols-3 gap-3">
                      {me.map((entry) => {
                        const cs = CARD_STYLES[entry.category] ?? CARD_STYLES["日常"];
                        return (
                        <Link key={entry.id} href={`/entries/${entry.id}`}>
                          <div
                            className="overflow-hidden cursor-pointer flex h-full active:scale-[0.98] transition-transform duration-100 rounded-[16px]"
                            style={{ background: cs.bg, border: `1px solid ${cs.borderColor}`, boxShadow: "var(--card-shadow)", minHeight: 80, touchAction: "manipulation" }}>
                            <div className="w-1 flex-shrink-0 rounded-l-[16px]" style={{ background: cs.accent }} />
                            <div className="flex-1 p-4">
                              <div className="flex items-start gap-3">
                                {entry.image_url ? (
                                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={entry.image_url} alt="" className="w-full h-full object-cover opacity-90" />
                                  </div>
                                ) : (
                                  <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center"
                                    style={{ background: `${cs.accent}22` }}>
                                    <span className="text-2xl">{CATEGORY_ICONS[entry.category]}</span>
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                    <span className="text-[12px] font-bold leading-none" style={{ color: cs.labelColor }}>
                                      {entry.category}
                                    </span>
                                    <span className="text-[11px] text-muted">{Number(entry.entry_date.split("-")[2])}日</span>
                                  </div>
                                  <p className="text-sm font-bold text-primary leading-snug">{entry.title}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
