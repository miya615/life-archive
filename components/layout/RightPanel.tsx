"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Clock, Quote, TrendingUp } from "lucide-react";
import type { Entry } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/types";

function pad(n: number) { return String(n).padStart(2, "0"); }

const DAILY_QUOTES = [
  "未来の自分が読み返したくなる一文を残そう。",
  "記録することは、記憶に命を与えること。",
  "今日の小さな気づきが、10年後の宝物になる。",
  "人生は点の集まり。記録がそれを線につなぐ。",
  "過去を振り返ることで、未来が見えてくる。",
  "記録は、未来の自分への手紙。",
  "どんな些細なことも、あなたの人生の一部。",
  "今日を丁寧に生きた証を残そう。",
  "時間は流れるが、記録は残る。",
  "今日の感情は、明日には変わっているかもしれない。",
  "あなたの歴史は、あなただけが書ける。",
  "小さな記録が、大きな物語になる。",
  "一日一日の積み重ねが、あなたの歴史になる。",
  "今日の自分を、未来の自分に贈ろう。",
];

interface PanelData {
  oneYearAgo: Entry[];
  weekCount: number;
  weekTopCategories: { cat: string; count: number }[];
  monthCount: number;
}

export function RightPanel() {
  const [data, setData] = useState<PanelData | null>(null);

  // Daily quote — stable per day
  const doy = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const quote = DAILY_QUOTES[doy % DAILY_QUOTES.length];

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
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split("T")[0];

      const [
        { data: oneYear },
        { count: wc },
        { data: weekEntries },
        { count: mc },
      ] = await Promise.all([
        supabase.from("entries").select("*")
          .eq("user_id", user.id)
          .like("entry_date", `%-${mm}-${dd}`)
          .neq("entry_date", `${thisYear}-${mm}-${dd}`)
          .order("entry_date", { ascending: false })
          .limit(3),
        supabase.from("entries").select("*", { count: "exact", head: true })
          .eq("user_id", user.id).gte("entry_date", weekAgoStr),
        supabase.from("entries").select("category")
          .eq("user_id", user.id).gte("entry_date", weekAgoStr),
        supabase.from("entries").select("*", { count: "exact", head: true })
          .eq("user_id", user.id).gte("entry_date", startOfMonth),
      ]);

      const catMap: Record<string, number> = {};
      for (const r of weekEntries ?? []) {
        catMap[r.category] = (catMap[r.category] ?? 0) + 1;
      }
      const weekTopCats = Object.entries(catMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([cat, count]) => ({ cat, count }));

      setData({
        oneYearAgo: oneYear ?? [],
        weekCount: wc ?? 0,
        weekTopCategories: weekTopCats,
        monthCount: mc ?? 0,
      });
    }
    load();
  }, []);

  return (
    <aside className="glass-right hidden xl:flex flex-col w-[290px] 2xl:w-[320px] flex-shrink-0 h-screen sticky top-0 overflow-y-auto px-5 py-7 gap-4">
      {!data ? (
        <>
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass h-28 animate-pulse" style={{ borderRadius: 24 }} />
          ))}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-4"
        >

          {/* 今日の一言 */}
          <div className="glass p-5" style={{ borderLeft: "3px solid var(--accent)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Quote style={{ width: 14, height: 14, color: "var(--accent)" }} strokeWidth={1.8} />
              <p className="text-[11px] font-medium text-muted uppercase tracking-widest">今日の一言</p>
            </div>
            <p className="text-[14px] text-primary font-medium leading-relaxed" style={{ fontStyle: "italic" }}>
              &ldquo;{quote}&rdquo;
            </p>
          </div>

          {/* 今週のあなた */}
          <div className="glass p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp style={{ width: 14, height: 14, color: "var(--accent)" }} strokeWidth={1.8} />
              <p className="text-[13px] font-semibold text-secondary">今週のあなた</p>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-primary">{data.weekCount}</span>
              <span className="text-[12px] text-muted">件の記録</span>
            </div>

            {data.weekTopCategories.length > 0 ? (
              <>
                <p className="text-[11px] text-muted mb-3">よく書いているテーマ</p>
                <div className="space-y-2.5">
                  {data.weekTopCategories.map(({ cat, count }) => (
                    <div key={cat} className="flex items-center gap-2.5">
                      <span className="text-base flex-shrink-0">{CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS]}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[12px] text-secondary font-medium">{cat}</span>
                          <span className="text-[11px] text-muted">{count}件</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--glass-border)" }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-dark))" }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(count / (data.weekCount || 1)) * 100}%` }}
                            transition={{ duration: 0.9, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-[12px] text-muted">今週はまだ記録がありません</p>
            )}
          </div>

          {/* 1年前の今日 */}
          <div className="glass p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles style={{ width: 14, height: 14, color: "var(--accent)" }} strokeWidth={1.8} />
              <p className="text-[13px] font-semibold text-secondary">1年前の今日は？</p>
            </div>

            {data.oneYearAgo.length === 0 ? (
              <div className="text-center py-4">
                <Clock className="mx-auto mb-2 text-muted" style={{ width: 28, height: 28 }} strokeWidth={1.2} />
                <p className="text-[12px] text-muted leading-relaxed">まだ1年前の記録はありません</p>
                <Link href="/timeline">
                  <motion.p
                    whileHover={{ x: 2 }}
                    className="text-[12px] mt-3 cursor-pointer inline-flex items-center gap-1"
                    style={{ color: "var(--accent)" }}
                  >
                    過去を振り返る <ArrowRight style={{ width: 11, height: 11 }} />
                  </motion.p>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.oneYearAgo.map((entry) => (
                  <Link key={entry.id} href={`/entries/${entry.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 2 }}
                      whileTap={{ scale: 0.97 }}
                      className="glass p-3 cursor-pointer"
                      style={{ borderRadius: 16 }}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-[18px] flex-shrink-0 mt-0.5">
                          {CATEGORY_ICONS[entry.category]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-primary truncate">{entry.title}</p>
                          <p className="text-[10px] text-muted mt-0.5">
                            {new Date(entry.entry_date).getFullYear()}年 &middot; {entry.category}
                          </p>
                          {entry.content && (
                            <p className="text-[11px] text-muted mt-1 line-clamp-2 leading-relaxed">{entry.content}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
                <Link href="/timeline">
                  <motion.p
                    whileHover={{ x: 2 }}
                    className="text-[12px] mt-1 cursor-pointer flex items-center gap-1"
                    style={{ color: "var(--accent)" }}
                  >
                    もっと振り返る <ArrowRight style={{ width: 11, height: 11 }} />
                  </motion.p>
                </Link>
              </div>
            )}
          </div>

          {/* 今月の記録 */}
          <div className="glass p-5">
            <p className="text-[11px] text-muted mb-2">今月の記録数</p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-primary">{data.monthCount}</span>
              <span className="text-[12px] text-muted">件</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--glass-border)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-dark))" }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((data.monthCount / 30) * 100, 100)}%` }}
                transition={{ duration: 1.2, delay: 0.5 }}
              />
            </div>
            <p className="text-[10px] text-muted mt-1.5 text-right">{data.monthCount}/30件 目標</p>
          </div>

        </motion.div>
      )}
    </aside>
  );
}
