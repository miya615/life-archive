"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Home, BookOpen, CalendarDays, User, Plus,
  Feather, LogOut, BarChart3,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/",         label: "ホーム",     icon: Home },
  { href: "/entries",  label: "記録一覧",   icon: BookOpen },
  { href: "/timeline", label: "人生年表",   icon: CalendarDays },
  { href: "/profile",  label: "マイページ", icon: User },
];

interface UserStats {
  displayName: string;
  email: string;
  todayCount: number;
  totalCount: number;
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
      const today = new Date().toISOString().split("T")[0];
      const [{ data: profile }, { count: total }, { count: todayC }] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("id", user.id).single(),
        supabase.from("entries").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("entries").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("entry_date", today),
      ]);
      setStats({
        displayName: profile?.display_name ?? user.email?.split("@")[0] ?? "ゲスト",
        email: user.email ?? "",
        todayCount: todayC ?? 0,
        totalCount: total ?? 0,
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
    <aside className="glass-sidebar hidden lg:flex flex-col w-[270px] xl:w-[290px] flex-shrink-0 h-screen sticky top-0 z-40 overflow-y-auto">

      {/* Logo */}
      <div className="px-6 pt-7 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", boxShadow: "0 4px 16px var(--accent-glow)" }}>
            <Feather className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-[15px] font-bold text-primary tracking-tight leading-none">Life Chronicle</p>
            <p className="text-[11px] text-muted mt-0.5 font-normal">人生の第二の脳</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 mb-4 h-px" style={{ background: "var(--glass-border)" }} />

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 px-3 flex-1">
        <p className="text-[10px] font-medium text-muted uppercase tracking-widest px-3 mb-2">メニュー</p>
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer"
                style={{
                  background: active ? "var(--glass-strong-bg)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-muted)",
                  borderLeft: `3px solid ${active ? "var(--accent)" : "transparent"}`,
                }}
              >
                <Icon className="flex-shrink-0" style={{ width: 17, height: 17 }} strokeWidth={active ? 2.2 : 1.6} />
                <span className="text-[14px] font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Quick add button */}
      <div className="px-5 my-4">
        <Link href="/entries/new">
          <motion.div
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-white text-[13px] font-semibold cursor-pointer"
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
              boxShadow: "0 4px 18px var(--accent-glow)",
            }}
          >
            <Plus style={{ width: 15, height: 15 }} strokeWidth={2.5} />
            今日を記録する
          </motion.div>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-6 mb-4 h-px" style={{ background: "var(--glass-border)" }} />

      {/* Stats */}
      {stats && (
        <div className="mx-5 mb-4">
          <p className="text-[10px] font-medium text-muted uppercase tracking-widest px-1 mb-2">今日の記録</p>
          <div className="glass p-4 rounded-2xl" style={{ borderRadius: 18 }}>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <BarChart3 style={{ width: 13, height: 13, color: "var(--accent)" }} strokeWidth={1.8} />
                <span className="text-[12px] text-secondary">今日</span>
              </div>
              <span className="text-[14px] font-bold text-primary">{stats.todayCount}件</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen style={{ width: 13, height: 13, color: "var(--accent)" }} strokeWidth={1.8} />
                <span className="text-[12px] text-secondary">総記録数</span>
              </div>
              <span className="text-[14px] font-bold text-primary">{stats.totalCount}件</span>
            </div>
          </div>
        </div>
      )}

      {/* User profile */}
      <div className="mx-5 mb-6">
        <div className="glass p-4 rounded-2xl" style={{ borderRadius: 18 }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-[14px] flex-shrink-0"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))" }}
            >
              {stats?.displayName?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-primary truncate">{stats?.displayName ?? "..."}</p>
              <p className="text-[10px] text-muted truncate">{stats?.email ?? ""}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-medium cursor-pointer"
            style={{ background: "rgba(239,68,68,0.09)", color: "#f87171", border: "1px solid rgba(239,68,68,0.16)" }}
          >
            <LogOut style={{ width: 12, height: 12 }} /> ログアウト
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
      <div className="flex items-center justify-around px-2 pt-2 pb-1.5 max-w-lg mx-auto">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.86 }}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl min-w-[64px]"
                style={{
                  background: active ? "var(--glass-strong-bg)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                <Icon style={{ width: 20, height: 20 }} strokeWidth={active ? 2.2 : 1.6} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
