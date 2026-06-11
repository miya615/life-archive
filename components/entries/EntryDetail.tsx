"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Edit2, Trash2, AlertTriangle, X } from "lucide-react";
import { Entry, CATEGORY_ICONS } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric", weekday: "long",
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
      if (path) await supabase.storage.from("entry-images").remove([path]);
    }
    await supabase.from("entries").delete().eq("id", entry.id);
    router.push("/entries");
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-2xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
          onClick={() => router.back()} className="w-9 h-9 glass rounded-2xl flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-secondary" strokeWidth={2} />
        </motion.button>
        <div className="flex gap-2">
          <Link href={`/entries/${entry.id}/edit`}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 h-9 px-4 glass rounded-2xl text-sm font-medium text-secondary cursor-pointer">
              <Edit2 className="w-3.5 h-3.5" /> 編集
            </motion.div>
          </Link>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 h-9 px-4 rounded-2xl text-sm font-medium"
            style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
            <Trash2 className="w-3.5 h-3.5" /> 削除
          </motion.button>
        </div>
      </div>

      {/* Image */}
      {entry.image_url && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="rounded-3xl overflow-hidden mb-5 shadow-2xl" style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.4)" }}>
          <img src={entry.image_url} alt="" className="w-full max-h-80 object-cover opacity-90" />
        </motion.div>
      )}

      {/* Content */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="glass-strong p-6 lg:p-8 space-y-5"
        style={{ boxShadow: "var(--card-shadow)" }}
      >
        {/* Meta */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs px-3 py-1 rounded-full font-medium"
            style={{ background: "var(--glass-bg)", color: "var(--accent)", border: "1px solid var(--glass-border)" }}>
            {CATEGORY_ICONS[entry.category]} {entry.category}
          </span>
          <span className="text-xs text-muted">{formatDate(entry.entry_date)}</span>
        </div>

        {/* Title */}
        <h1 className="text-xl lg:text-2xl font-bold text-primary leading-snug">{entry.title}</h1>

        {/* Divider */}
        <div className="h-px" style={{ background: "var(--glass-border)" }} />

        {/* Content */}
        {entry.content && (
          <p className="text-sm lg:text-base text-secondary leading-relaxed whitespace-pre-wrap">{entry.content}</p>
        )}

        {/* Timestamps */}
        <div className="pt-2" style={{ borderTop: "1px solid var(--glass-border)" }}>
          <p className="text-[10px] text-muted">
            作成: {new Date(entry.created_at).toLocaleDateString("ja-JP")}
            {entry.updated_at !== entry.created_at && <> ・ 更新: {new Date(entry.updated_at).toLocaleDateString("ja-JP")}</>}
          </p>
        </div>
      </motion.div>

      {/* Delete modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)" }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="glass-strong w-full max-w-sm p-6"
              style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <AlertTriangle className="w-5 h-5" style={{ color: "#f87171" }} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-primary">記録を削除しますか？</h3>
                  <p className="text-xs text-muted">この操作は取り消せません。</p>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 glass rounded-2xl text-sm font-medium text-secondary flex items-center justify-center gap-1.5">
                  <X className="w-4 h-4" /> キャンセル
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleDelete} disabled={deleting}
                  className="flex-1 py-3 rounded-2xl text-sm font-medium text-white flex items-center justify-center gap-1.5 disabled:opacity-60"
                  style={{ background: "#ef4444", boxShadow: "0 4px 16px rgba(239,68,68,0.3)" }}>
                  <Trash2 className="w-4 h-4" /> {deleting ? "削除中..." : "削除する"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
