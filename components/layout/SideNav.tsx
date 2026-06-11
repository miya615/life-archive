"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  Clock,
  User,
  Plus,
  Feather,
} from "lucide-react";

const NAV = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/entries", label: "記録一覧", icon: BookOpen },
  { href: "/timeline", label: "人生年表", icon: Clock },
  { href: "/profile", label: "マイページ", icon: User },
];

/* Chronicle logo mark */
function Logo() {
  return (
    <div className="flex items-center gap-3 px-2 py-1">
      <div
        className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
        style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))" }}
      >
        <Feather className="w-4 h-4 text-white" strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-sm font-bold text-primary tracking-tight leading-none">Life Chronicle</p>
        <p className="text-[10px] text-muted mt-0.5">人生の第二の脳</p>
      </div>
    </div>
  );
}

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="glass-sidebar hidden lg:flex flex-col w-[280px] flex-shrink-0 h-screen sticky top-0 z-40">
      {/* Logo */}
      <div className="px-5 pt-7 pb-6">
        <Logo />
      </div>

      {/* New entry CTA */}
      <div className="px-4 mb-6">
        <Link href="/entries/new">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white text-sm font-medium shadow-lg"
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
              boxShadow: "0 4px 20px var(--accent-glow)",
            }}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            新しい記録を追加
          </motion.div>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px mb-4" style={{ background: "var(--glass-border)" }} />

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-colors relative"
                style={{
                  background: active ? "var(--glass-strong-bg)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-muted)",
                  borderLeft: active ? `3px solid var(--accent)` : "3px solid transparent",
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={active ? 2 : 1.8} />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom spacer */}
      <div className="px-4 pb-6 pt-4">
        <div className="h-px mb-4" style={{ background: "var(--glass-border)" }} />
        <p className="text-[10px] text-muted text-center">Life Chronicle v1.0</p>
      </div>
    </aside>
  );
}

/* Mobile bottom nav */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden glass-nav fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="flex items-center justify-around px-2 pt-2 pb-1 max-w-lg mx-auto">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.88 }}
                className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl min-w-[60px]"
                style={{
                  background: active ? "var(--glass-strong-bg)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-muted)",
                }}
              >
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
