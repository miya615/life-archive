"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Edit2, LogOut, Check, X, BookOpen, Image, Tag, Sparkles } from "lucide-react";
import { CATEGORY_ICONS } from "@/lib/types";

interface Props {
  email: string; displayName: string; avatarUrl: string | null;
  totalEntries: number; photoCount: number;
  categoryStats: Record<string, number>; memberSince: string;
}

export function ProfileContent({ email, displayName: init, avatarUrl, totalEntries, photoCount, categoryStats, memberSince }: Props) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(init);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("profiles").upsert({ id: user!.id, display_name: displayName, updated_at: new Date().toISOString() });
    setSaving(false); setEditing(false); router.refresh();
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  const topCats = Object.entries(categoryStats).sort(([, a], [, b]) => b - a).slice(0, 6);
  const daysUsing = Math.floor((Date.now() - new Date(memberSince).getTime()) / 86400000);

  const stats = [
    { label: "総記録数", value: totalEntries, icon: BookOpen },
    { label: "写真付き", value: photoCount, icon: Image },
    { label: "カテゴリ数", value: Object.keys(categoryStats).length, icon: Tag },
    { label: "利用日数", value: daysUsing, icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-primary">マイページ</h1>
        <p className="text-xs text-muted mt-1">アカウントと記録の統計</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left */}
        <div className="flex flex-col gap-5 lg:w-80 flex-shrink-0">
          {/* Profile card */}
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="glass-strong p-6"
            style={{ boxShadow: "0 8px 40px var(--accent-glow)" }}
          >
            {/* Avatar */}
            <div className="flex flex-col items-center mb-5">
              <div className="w-20 h-20 rounded-3xl overflow-hidden flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-3"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))" }}>
                {avatarUrl
                  ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                  : displayName.charAt(0).toUpperCase()
                }
              </div>
              {editing ? (
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                  className="text-center text-base font-semibold text-primary bg-transparent border-b w-48"
                  style={{ borderColor: "var(--accent)" }}
                  autoFocus
                />
              ) : (
                <p className="text-base font-semibold text-primary">{displayName}</p>
              )}
              <p className="text-xs text-muted mt-1">{email}</p>
              <p className="text-[10px] text-muted mt-1">
                {new Date(memberSince).toLocaleDateString("ja-JP")} から利用
              </p>
            </div>

            {/* Edit buttons */}
            {editing ? (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)}
                  className="flex-1 py-2.5 glass rounded-2xl text-sm font-medium text-secondary flex items-center justify-center gap-1.5 active:scale-[0.95] active:opacity-80 transition-transform duration-100"
                  style={{ touchAction: "manipulation" }}>
                  <X className="w-3.5 h-3.5" /> キャンセル
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-2.5 rounded-2xl text-sm font-medium text-white flex items-center justify-center gap-1.5 disabled:opacity-60 active:scale-[0.95] active:opacity-90 transition-transform duration-100"
                  style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", touchAction: "manipulation" }}>
                  <Check className="w-3.5 h-3.5" /> {saving ? "保存中..." : "保存"}
                </button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)}
                className="w-full py-2.5 glass rounded-2xl text-sm font-medium text-secondary flex items-center justify-center gap-2 active:scale-[0.97] active:opacity-80 transition-transform duration-100"
                style={{ touchAction: "manipulation" }}>
                <Edit2 className="w-3.5 h-3.5" /> 名前を変更
              </button>
            )}
          </motion.div>

          {/* AI teaser */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="glass p-5" style={{ border: "1px solid rgba(var(--accent-rgb, 167, 139, 250), 0.35)" }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, var(--glass-strong-bg), var(--glass-bg))", border: "1px solid var(--glass-border)" }}>
                <span className="text-xl">✨</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">AI機能 — 近日公開</p>
                <p className="text-xs text-muted mt-1 leading-relaxed">AI検索・月末レポート・第二の脳機能を準備中。</p>
              </div>
            </div>
          </motion.div>

          {/* Sign out */}
          <button onClick={handleSignOut}
            className="w-full py-3.5 glass rounded-2xl text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.97] active:opacity-80 transition-transform duration-100"
            style={{ color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", touchAction: "manipulation" }}>
            <LogOut className="w-4 h-4" /> ログアウト
          </button>
        </div>

        {/* Right */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
                className="glass p-4 text-center"
              >
                <s.icon className="w-4 h-4 text-accent mx-auto mb-2" strokeWidth={1.8} />
                <p className="text-2xl lg:text-3xl font-bold text-primary">{s.value}</p>
                <p className="text-[10px] text-muted mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Category chart */}
          {topCats.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="glass p-6 flex-1">
              <h3 className="text-sm font-semibold text-secondary mb-5">カテゴリ別記録</h3>
              <div className="space-y-4">
                {topCats.map(([cat, count], i) => (
                  <motion.div key={cat} className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.07 }}>
                    <span className="text-base w-6 text-center flex-shrink-0">
                      {CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS] ?? "📝"}
                    </span>
                    <span className="text-sm text-secondary w-16 flex-shrink-0 truncate">{cat}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--glass-border)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-dark))" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / totalEntries) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.07 }}
                      />
                    </div>
                    <span className="text-xs text-muted w-8 text-right flex-shrink-0">{count}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
