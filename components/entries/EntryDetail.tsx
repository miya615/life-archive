"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Entry, CATEGORY_ICONS } from "@/lib/types";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export function EntryDetail({ entry }: { entry: Entry }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const supabase = createClient();
    if (entry.image_url) {
      const path = entry.image_url.split("/entry-images/")[1];
      if (path) {
        await supabase.storage.from("entry-images").remove([path]);
      }
    }
    await supabase.from("entries").delete().eq("id", entry.id);
    router.push("/entries");
  }

  return (
    <div className="py-8 animate-fade-up relative z-10">
      {/* Back */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 glass rounded-2xl flex items-center justify-center shadow-lg shadow-black/20"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-white/70">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div className="flex gap-2">
          <Link href={`/entries/${entry.id}/edit`}>
            <div className="h-9 px-4 glass rounded-2xl flex items-center shadow-sm text-sm font-medium text-secondary">
              編集
            </div>
          </Link>
          <button
            onClick={() => setShowConfirm(true)}
            className="h-9 px-4 bg-red-500/15 border border-red-500/20 rounded-2xl flex items-center text-sm font-medium text-red-400"
          >
            削除
          </button>
        </div>
      </div>

      {/* Image */}
      {entry.image_url && (
        <div className="rounded-3xl overflow-hidden mb-5 shadow-2xl shadow-black/40">
          <img src={entry.image_url} alt="" className="w-full max-h-72 object-cover opacity-90" />
        </div>
      )}

      {/* Content card */}
      <div className="glass-strong rounded-3xl p-6 shadow-2xl shadow-black/30 space-y-4">
        {/* Meta */}
        <div className="flex items-center gap-3">
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-white/10 text-violet-300 border border-white/10">
            {CATEGORY_ICONS[entry.category]} {entry.category}
          </span>
          <span className="text-xs text-muted">{formatDate(entry.entry_date)}</span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-primary leading-snug">{entry.title}</h1>

        {/* Content */}
        {entry.content && (
          <p className="text-sm text-secondary leading-relaxed whitespace-pre-wrap">{entry.content}</p>
        )}

        {/* Timestamps */}
        <div className="pt-3 border-t border-white/8">
          <p className="text-[10px] text-muted">
            作成: {new Date(entry.created_at).toLocaleDateString("ja-JP")}
            {entry.updated_at !== entry.created_at && (
              <> ・ 更新: {new Date(entry.updated_at).toLocaleDateString("ja-JP")}</>
            )}
          </p>
        </div>
      </div>

      {/* Delete confirm */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end justify-center z-50 p-4">
          <div className="glass-strong rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-semibold text-primary mb-2">記録を削除しますか？</h3>
            <p className="text-sm text-muted mb-5">この操作は取り消せません。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 glass rounded-2xl text-sm font-medium text-secondary"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 bg-red-500 rounded-2xl text-sm font-medium text-white disabled:opacity-60 shadow-lg shadow-red-500/30"
              >
                {deleting ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
