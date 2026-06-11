"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CATEGORY_ICONS } from "@/lib/types";

interface Props {
  email: string;
  displayName: string;
  avatarUrl: string | null;
  totalEntries: number;
  photoCount: number;
  categoryStats: Record<string, number>;
  memberSince: string;
}

export function ProfileContent({
  email,
  displayName: initialDisplayName,
  avatarUrl,
  totalEntries,
  photoCount,
  categoryStats,
  memberSince,
}: Props) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from("profiles")
      .upsert({ id: user!.id, display_name: displayName, updated_at: new Date().toISOString() });
    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return (
    <div className="py-8 space-y-5 animate-fade-up">
      <h1 className="text-xl font-bold text-gray-800">マイページ</h1>

      {/* Profile card */}
      <div className="glass rounded-3xl p-6 shadow-lg shadow-indigo-100/30">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-300 to-purple-300 flex items-center justify-center text-white text-2xl font-bold shadow-md flex-shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-full h-full object-cover rounded-3xl" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full text-base font-semibold text-gray-800 bg-white/70 rounded-xl px-3 py-1.5 border border-white/60"
              />
            ) : (
              <p className="text-base font-semibold text-gray-800 truncate">{displayName}</p>
            )}
            <p className="text-xs text-gray-400 mt-0.5 truncate">{email}</p>
            <p className="text-[10px] text-gray-400 mt-1">
              {new Date(memberSince).toLocaleDateString("ja-JP")} から利用中
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="flex-1 py-2.5 glass rounded-xl text-sm font-medium text-gray-600">
                キャンセル
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-indigo-500 rounded-xl text-sm font-medium text-white disabled:opacity-60">
                {saving ? "保存中..." : "保存"}
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="flex-1 py-2.5 glass rounded-xl text-sm font-medium text-gray-600">
              名前を変更
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-3xl p-5 shadow-md shadow-indigo-100/30 text-center">
          <p className="text-3xl font-bold text-gray-800">{totalEntries}</p>
          <p className="text-xs text-gray-400 mt-1">総記録数</p>
        </div>
        <div className="glass rounded-3xl p-5 shadow-md shadow-indigo-100/30 text-center">
          <p className="text-3xl font-bold text-gray-800">{photoCount}</p>
          <p className="text-xs text-gray-400 mt-1">写真の記録</p>
        </div>
      </div>

      {/* Category breakdown */}
      {topCategories.length > 0 && (
        <div className="glass rounded-3xl p-5 shadow-md shadow-indigo-100/30">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">カテゴリ別記録</h3>
          <div className="space-y-3">
            {topCategories.map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-base w-6 text-center">{CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS] ?? "📝"}</span>
                <span className="text-sm text-gray-700 flex-1">{cat}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
                      style={{ width: `${(count / totalEntries) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI feature teaser */}
      <div className="glass rounded-3xl p-5 shadow-md shadow-indigo-100/30 border border-indigo-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">AI機能 — 近日公開</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              AI検索、月末レポート、第二の脳機能を準備中。あなたの記録をより深く活用できるようになります。
            </p>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full py-3.5 glass rounded-2xl text-sm font-medium text-red-500 shadow-sm"
      >
        ログアウト
      </button>
    </div>
  );
}
