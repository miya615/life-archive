"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, BookOpen, CalendarDays, User, Plus, Feather, LogOut, BarChart3 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/",         label: "ホーム",   icon: Home },
  { href: "/entries",  label: "記録一覧", icon: BookOpen },
  { href: "/timeline", label: "人生年表", icon: CalendarDays },
  { href: "/profile",  label: "マイページ", icon: User },
];

interface UserStats {
  displayName: string;
  email: string;
  todayCount: number;
  totalCount: number;
  monthCount: number;
}

export function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
      const [{ data: profile }, { count: total }, { count: today_c }, { count: month_c }] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("id", user.id).single(),
        supabase.from("entries").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("entries").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("entry_date", today),
        supabase.from("entries").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("entry_date", startOfMonth),
      ]);
      setStats({
        displayName: profile?.display_name ?? user.email?.split("@")[0] ?? "ゲスト",
        email: user.email ?? "",
        todayCount: today_c ?? 0,
        totalCount: total ?? 0,
        monthCount: month_c ?? 0,
      });
    }
    load();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth");
  }

  return (
    <aside className="glass-sidebar hidden lg:flex flex-col w-[300px] xl:w-[320px] flex-shrink-0 h-screen sticky top-0 z-40 overflow-y-auto">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", boxShadow: "0 4px 16px var(--accent-glow)" }}>
            <Feather className="w-5 h-5 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-base font-bold text-primary tracking-tight leading-none">Life Chronicle</p>
            <p className="text-xs text-muted mt-0.5">人生の第二の脳</p>
          </div>
        </div>
      </div>

      {/* New entry */}
      <div className="px-5 mb-5">
        <Link href="/entries/new">
          <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl text-white text-sm font-semibold cursor-pointer"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", boxShadow: "0 4px 20px var(--accent-glow)" }}>
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            新しい記録を追加
          </motion.div>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-5 mb-4 h-px" style={{ background: "var(--glass-border)" }} />

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-4 flex-1">
        <p className="text-[10px] font-semibold text-muted uppercase tracking-widest px-3 mb-2">メニュー</p>
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all cursor-pointer"
                style={{
                  background: active ? "var(--glass-strong-bg)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-muted)",
                  borderLeft: `3px solid ${active ? "var(--accent)" : "transparent"}`,
                  boxShadow: active ? "0 2px 16px var(--accent-glow)" : "none",
                }}>
                <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={active ? 2 : 1.7} />
                <span className="text-sm font-medium">{item.label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Stats mini panel */}
      {stats && (
        <div className="mx-5 mb-4">
          <div className="h-px mb-4" style={{ background: "var(--glass-border)" }} />
          <p className="text-[10px] font-semibold text-muted uppercase tracking-widest px-1 mb-3">統計</p>
          <div className="glass rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-accent" strokeWidth={1.8} />
                <span className="text-xs text-secondary">今日の記録</span>
              </div>
              <span className="text-sm font-bold text-primary">{stats.todayCount}件</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-3.5 h-3.5 text-accent" strokeWidth={1.8} />
                <span className="text-xs text-secondary">今月の記録</span>
              </div>
              <span className="text-sm font-bold text-primary">{stats.monthCount}件</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-accent" strokeWidth={1.8} />
                <span className="text-xs text-secondary">総記録数</span>
              </div>
              <span className="text-sm font-bold text-primary">{stats.totalCount}件</span>
            </div>
          </div>
        </div>
      )}

      {/* User profile */}
      <div className="mx-5 mb-6">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-md"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))" }}>
              {stats?.displayName?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary truncate">{stats?.displayName ?? "..."}</p>
              <p className="text-[10px] text-muted truncate">{stats?.email ?? ""}</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium"
            style={{ background: "rgba(239,68,68,0.10)", color: "#f87171", border: "1px solid rgba(239,68,68,0.18)" }}>
            <LogOut className="w-3.5 h-3.5" /> ログアウト
          </motion.button>
        </div>
      </div>
    </aside>
  );
}

/* ── Mobile bottom nav ── */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden glass-nav fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="flex items-center justify-around px-2 pt-2.5 pb-1.5 max-w-lg mx-auto">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div whileTap={{ scale: 0.86 }}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl min-w-[64px]"
                style={{ background: active ? "var(--glass-strong-bg)" : "transparent", color: active ? "var(--accent)" : "var(--text-muted)" }}>
                <Icon className="w-5 h-5" strokeWidth={active ? 2 : 1.6} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
