"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Home, BookOpen, CalendarDays, User, Plus,
  Feather, LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/",         label: "今日",  icon: Home },
  { href: "/entries",  label: "記憶",  icon: BookOpen },
  { href: "/timeline", label: "年表",  icon: CalendarDays },
  { href: "/profile",  label: "自分",  icon: User },
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
    <aside className="glass-sidebar hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0 z-40 overflow-y-auto"
      style={{ width: 220 }}>

      {/* Logo */}
      <div className="px-5 pt-7 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", boxShadow: "0 4px 12px var(--accent-glow)" }}>
            <Feather style={{ width: 14, height: 14 }} className="text-white" strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-primary truncate">Life Chronicle</p>
            <p className="text-[10px] text-muted truncate">人生ノート</p>
          </div>
        </div>
      </div>

      <div className="mx-5 mb-3 h-px" style={{ background: "var(--glass-border)" }} />

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 px-3 flex-1">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                style={{
                  background: active ? "var(--glass-strong-bg)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                <Icon style={{ width: 16, height: 16 }} strokeWidth={active ? 2.2 : 1.6} className="flex-shrink-0" />
                <span className="text-[13px] font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Quick add */}
      <div className="px-4 my-4">
        <Link href="/entries/new">
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-white text-[12px] font-semibold cursor-pointer"
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
              boxShadow: "0 4px 14px var(--accent-glow)",
            }}
          >
            <Plus style={{ width: 13, height: 13 }} strokeWidth={2.5} />
            今日を記録する
          </motion.div>
        </Link>
      </div>

      <div className="mx-5 mb-4 h-px" style={{ background: "var(--glass-border)" }} />

      {/* User profile */}
      <div className="mx-4 mb-6">
        {stats && (
          <div className="glass p-3 rounded-xl" style={{ borderRadius: 16 }}>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))" }}>
                {stats.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-primary truncate">{stats.displayName}</p>
                <p className="text-[9px] text-muted truncate">{stats.totalCount}件の記録</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer"
              style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.14)" }}
            >
              <LogOut style={{ width: 11, height: 11 }} /> ログアウト
            </motion.button>
          </div>
        )}
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
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl min-w-[56px]"
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
