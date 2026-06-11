"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, ArrowRight, Clock } from "lucide-react";
import type { Entry } from "@/lib/types";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/types";

function pad(n: number) { return String(n).padStart(2, "0"); }

interface PanelData {
  todayCount: number;
  monthCount: number;
  weekCount: number;
  photoCount: number;
  oneYearAgo: Entry[];
  recentByCategory: Record<string, number>;
  topCategory: string | null;
}

export function RightPanel() {
  const [data, setData] = useState<PanelData | null>(null);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const mm = pad(now.getMonth() + 1);
      const dd = pad(now.getDate());
      const thisYear = now.getFullYear();
      const startOfMonth = `${thisYear}-${mm}-01`;
      const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);

      const [
        { count: todayC },
        { count: monthC },
        { count: weekC },
        { count: photoC },
        { data: oneYear },
        { data: allCats },
      ] = await Promise.all([
        supabase.from("entries").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("entry_date", today),
        supabase.from("entries").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("entry_date", startOfMonth),
        supabase.from("entries").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("entry_date", weekAgo.toISOString().split("T")[0]),
        supabase.from("entries").select("*", { count: "exact", head: true }).eq("user_id", user.id).not("image_url", "is", null),
        supabase.from("entries").select("*").eq("user_id", user.id)
          .like("entry_date", `%-${mm}-${dd}`)
          .neq("entry_date", `${thisYear}-${mm}-${dd}`)
          .order("entry_date", { ascending: false }).limit(3),
        supabase.from("entries").select("category").eq("user_id", user.id).gte("entry_date", startOfMonth),
      ]);

      const catMap: Record<string, number> = {};
      for (const r of allCats ?? []) catMap[r.category] = (catMap[r.category] ?? 0) + 1;
      const topCat = Object.entries(catMap).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;

      setData({
        todayCount: todayC ?? 0,
        monthCount: monthC ?? 0,
        weekCount: weekC ?? 0,
        photoCount: photoC ?? 0,
        oneYearAgo: oneYear ?? [],
        recentByCategory: catMap,
        topCategory: topCat,
      });
    }
    load();
  }, []);

  return (
    <aside className="glass-right hidden xl:flex flex-col w-[300px] 2xl:w-[340px] flex-shrink-0 h-screen sticky top-0 overflow-y-auto px-5 py-8 gap-5">
      {!data ? (
        <>
          {[1,2,3].map(i => <div key={i} className="glass h-32 animate-pulse" style={{ borderRadius: 24 }} />)}
        </>
      ) : (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col gap-5">

          {/* Today's dashboard */}
          <div className="glass p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-accent" strokeWidth={1.8} />
              <p className="text-sm font-semibold text-secondary">今日のダッシュボード</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "今日", value: data.todayCount },
                { label: "今月", value: data.monthCount },
                { label: "今週", value: data.weekCount },
                { label: "写真付き", value: data.photoCount },
              ].map((s) => (
                <motion.div key={s.label} whileHover={{ scale: 1.04 }}
                  className="glass p-3 text-center" style={{ borderRadius: 16 }}>
                  <p className="text-2xl font-bold text-primary">{s.value}</p>
                  <p className="text-[10px] text-muted mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
            {/* Monthly progress */}
            <div>
              <div className="flex justify-between mb-1.5">
                <p className="text-[10px] text-muted">今月の目標 (30件)</p>
                <p className="text-[10px] text-accent font-medium">{Math.min(data.monthCount, 30)}/30</p>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--glass-border)" }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-dark))" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((data.monthCount / 30) * 100, 100)}%` }}
                  transition={{ duration: 1.2, delay: 0.4 }} />
              </div>
            </div>
          </div>

          {/* Top category */}
          {data.topCategory && (
            <div className="glass p-5">
              <p className="text-xs text-muted mb-2">今月いちばん多いカテゴリ</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{CATEGORY_ICONS[data.topCategory as keyof typeof CATEGORY_ICONS] ?? "📝"}</span>
                <div>
                  <p className="text-base font-bold text-primary">{data.topCategory}</p>
                  <p className="text-xs text-muted">{data.recentByCategory[data.topCategory]}件</p>
                </div>
              </div>
              {/* Category mini bars */}
              <div className="mt-4 space-y-2">
                {Object.entries(data.recentByCategory).sort(([,a],[,b])=>b-a).slice(0,4).map(([cat, cnt]) => (
                  <div key={cat} className="flex items-center gap-2">
                    <span className="text-xs text-secondary w-14 truncate">{cat}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--glass-border)" }}>
                      <motion.div className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-dark))" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(cnt / data.monthCount) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }} />
                    </div>
                    <span className="text-[10px] text-muted w-4 text-right">{cnt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 1 year ago today */}
          <div className="glass p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-accent" strokeWidth={1.8} />
              <p className="text-sm font-semibold text-secondary">1年前の今日</p>
            </div>
            {data.oneYearAgo.length === 0 ? (
              <div className="text-center py-3">
                <Clock className="w-8 h-8 text-muted mx-auto mb-2" strokeWidth={1.2} />
                <p className="text-xs text-muted">まだ1年前の記録はありません</p>
                <Link href="/entries">
                  <motion.p whileHover={{ x: 2 }} className="text-xs text-accent mt-2 cursor-pointer inline-flex items-center gap-1">
                    過去を振り返る <ArrowRight className="w-3 h-3" />
                  </motion.p>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.oneYearAgo.map((entry) => (
                  <Link key={entry.id} href={`/entries/${entry.id}`}>
                    <motion.div whileHover={{ scale: 1.02, x: 2 }} whileTap={{ scale: 0.97 }}
                      className="glass p-3 cursor-pointer" style={{ borderRadius: 16 }}>
                      <div className="flex items-start gap-2.5">
                        <span className="text-base flex-shrink-0">{CATEGORY_ICONS[entry.category]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-primary truncate">{entry.title}</p>
                          <p className="text-[10px] text-muted mt-0.5">{new Date(entry.entry_date).getFullYear()}年</p>
                          {entry.content && <p className="text-[10px] text-muted mt-0.5 line-clamp-1">{entry.content}</p>}
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
            <p className="text-xs font-semibold text-secondary mb-3">振り返りメニュー</p>
            <div className="space-y-1.5">
              {[
                { label: "人生年表で振り返る", href: "/timeline" },
                { label: "すべての記録を見る", href: "/entries" },
                { label: "マイページ", href: "/profile" },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div whileHover={{ x: 4 }}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer"
                    style={{ background: "var(--glass-bg)" }}>
                    <p className="text-xs text-secondary">{item.label}</p>
                    <ArrowRight className="w-3.5 h-3.5 text-muted" strokeWidth={1.5} />
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

        </motion.div>
      )}
    </aside>
  );
}
