"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Sparkles, Calendar, TrendingUp } from "lucide-react";
import type { Entry } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/types";

function formatShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
}

function pad(n: number) { return String(n).padStart(2, "0"); }

export function RightPanel() {
  const [thisDay, setThisDay] = useState<Entry[]>([]);
  const [monthCount, setMonthCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const mm = pad(now.getMonth() + 1);
      const dd = pad(now.getDate());
      const thisYear = now.getFullYear();
      const startOfMonth = `${thisYear}-${mm}-01`;
      const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);

      const [{ data: onThisDay }, { count: mc }, { count: wc }] = await Promise.all([
        supabase.from("entries")
          .select("*")
          .eq("user_id", user.id)
          .like("entry_date", `%-${mm}-${dd}`)
          .neq("entry_date", `${thisYear}-${mm}-${dd}`)
          .order("entry_date", { ascending: false })
          .limit(3),
        supabase.from("entries")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("entry_date", startOfMonth),
        supabase.from("entries")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("entry_date", weekAgo.toISOString().split("T")[0]),
      ]);

      setThisDay(onThisDay ?? []);
      setMonthCount(mc ?? 0);
      setWeekCount(wc ?? 0);
      setLoaded(true);
    }
    load();
  }, []);

  if (!loaded) return (
    <aside className="hidden xl:flex flex-col w-[280px] flex-shrink-0 h-screen sticky top-0 overflow-y-auto px-4 py-8 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="glass h-24 animate-pulse" style={{ borderRadius: 20 }} />
      ))}
    </aside>
  );

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="hidden xl:flex flex-col w-[280px] flex-shrink-0 h-screen sticky top-0 overflow-y-auto px-4 py-8 gap-4"
    >
      {/* Stats */}
      <div className="glass p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-accent" strokeWidth={1.8} />
          <p className="text-xs font-semibold text-secondary">記録の統計</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="glass p-3 text-center" style={{ borderRadius: 14 }}>
            <p className="text-2xl font-bold text-primary">{monthCount}</p>
            <p className="text-[10px] text-muted mt-1">今月</p>
          </div>
          <div className="glass p-3 text-center" style={{ borderRadius: 14 }}>
            <p className="text-2xl font-bold text-primary">{weekCount}</p>
            <p className="text-[10px] text-muted mt-1">今週</p>
          </div>
        </div>
        {/* Mini progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] text-muted">今月の目標 (30件)</p>
            <p className="text-[10px] text-accent">{Math.min(monthCount, 30)}/30</p>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--glass-border)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-dark))" }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((monthCount / 30) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* On this day */}
      <div className="glass p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-accent" strokeWidth={1.8} />
          <p className="text-xs font-semibold text-secondary">今日の過去の記録</p>
        </div>

        {thisDay.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-3xl mb-2">✦</p>
            <p className="text-xs text-muted">過去の記録がありません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {thisDay.map((entry) => (
              <Link key={entry.id} href={`/entries/${entry.id}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="glass p-3 cursor-pointer"
                  style={{ borderRadius: 14 }}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm flex-shrink-0">{CATEGORY_ICONS[entry.category]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-primary truncate">{entry.title}</p>
                      <p className="text-[10px] text-muted mt-0.5">
                        {new Date(entry.entry_date).getFullYear()}年
                        {formatShort(entry.entry_date)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="glass p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-accent" strokeWidth={1.8} />
          <p className="text-xs font-semibold text-secondary">振り返り</p>
        </div>
        <div className="space-y-2">
          {[
            { label: "人生年表を見る", href: "/timeline" },
            { label: "記録一覧を見る", href: "/entries" },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center justify-between py-2 px-3 rounded-xl cursor-pointer"
                style={{ background: "var(--glass-bg)" }}
              >
                <p className="text-xs text-secondary">{item.label}</p>
                <span className="text-muted text-xs">→</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
