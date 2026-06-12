"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, X, Loader2, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Category, CATEGORIES, CATEGORY_ICONS } from "@/lib/types";

const EMOTIONS = ["😊", "😢", "😤", "😌", "🤔", "🔥", "😴", "🥳"];
const WEATHERS = ["☀️", "⛅", "🌧️", "❄️", "🌙", "🌈"];

// Primary categories shown by default
const PRIMARY_CATEGORIES: Category[] = ["思い出", "健康", "仕事", "学習", "お金"];
const SECONDARY_CATEGORIES: Category[] = CATEGORIES.filter(
  (c) => !PRIMARY_CATEGORIES.includes(c)
);

export function NewEntryForm({ editEntry }: {
  editEntry?: {
    id: string; title: string; content: string | null;
    category: Category; entry_date: string; image_url: string | null;
  };
}) {
  const router = useRouter();
  const isEdit = !!editEntry;
  const [title, setTitle] = useState(editEntry?.title ?? "");
  const [content, setContent] = useState(editEntry?.content ?? "");
  const [category, setCategory] = useState<Category>(editEntry?.category ?? "日常");
  const [entryDate, setEntryDate] = useState(editEntry?.entry_date ?? new Date().toISOString().split("T")[0]);
  const [emotion, setEmotion] = useState("😊");
  const [weather, setWeather] = useState("☀️");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(editEntry?.image_url ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Auto-expand if the current category is in secondary list
  const [showAllCats, setShowAllCats] = useState(
    editEntry ? SECONDARY_CATEGORIES.includes(editEntry.category) : false
  );
  const [titleFocused, setTitleFocused] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("タイトルを入力してください"); return; }
    setLoading(true); setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth"); return; }

    let imageUrl = editEntry?.image_url ?? null;
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("entry-images").upload(path, imageFile, { upsert: true });
      if (uploadError) { setError("画像のアップロードに失敗しました"); setLoading(false); return; }
      imageUrl = supabase.storage.from("entry-images").getPublicUrl(path).data.publicUrl;
    }

    if (isEdit) {
      const { error: err } = await supabase.from("entries")
        .update({ title, content, category, entry_date: entryDate, image_url: imageUrl, updated_at: new Date().toISOString() })
        .eq("id", editEntry!.id);
      if (err) { setError(err.message); setLoading(false); return; }
      router.push(`/entries/${editEntry!.id}`);
    } else {
      const { error: err } = await supabase.from("entries")
        .insert({ user_id: user.id, title, content, category, entry_date: entryDate, image_url: imageUrl });
      if (err) { setError(err.message); setLoading(false); return; }
      router.push("/entries");
    }
  }

  const visibleCats = showAllCats ? CATEGORIES : PRIMARY_CATEGORIES;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 lg:mb-8">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => router.back()}
          className="w-11 h-11 glass rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ touchAction: "manipulation" }}
        >
          <ArrowLeft className="w-4 h-4 text-secondary" strokeWidth={2} />
        </motion.button>
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-primary">{isEdit ? "記録を編集" : "新しい記録"}</h1>
          <p className="text-xs text-muted mt-0.5">あなたの1ページを残しましょう</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ── Title (main focus) ── */}
        <div
          className="glass p-5 lg:p-6 transition-all duration-200"
          style={{
            borderColor: titleFocused ? "var(--accent)" : undefined,
            boxShadow: titleFocused ? "0 0 0 1px var(--accent), var(--card-shadow)" : undefined,
          }}
        >
          <label className="block text-[10px] font-semibold text-muted mb-3 uppercase tracking-widest">
            タイトル <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setTitleFocused(true)}
            onBlur={() => setTitleFocused(false)}
            placeholder="今日はどんな一日でしたか？"
            autoComplete="off"
            className="w-full bg-transparent font-bold text-primary placeholder:text-muted placeholder:font-normal leading-snug"
            style={{ fontSize: "clamp(20px, 5vw, 28px)" }}
          />
        </div>

        {/* ── Date + emotion + weather ── */}
        <div className="glass p-4 space-y-4">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-[110px]">
              <label className="block text-[10px] font-medium text-muted mb-1.5 uppercase tracking-wider">日付</label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-muted mb-1.5 uppercase tracking-wider">気分</label>
              <div className="flex gap-1 flex-wrap">
                {EMOTIONS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setEmotion(em)}
                    className="text-xl rounded-xl p-1.5 transition-all"
                    style={{
                      background: emotion === em ? "var(--glass-strong-bg)" : "transparent",
                      opacity: emotion === em ? 1 : 0.4,
                      touchAction: "manipulation",
                    }}
                  >{em}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-muted mb-1.5 uppercase tracking-wider">天気</label>
              <div className="flex gap-1">
                {WEATHERS.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWeather(w)}
                    className="text-xl rounded-xl p-1.5 transition-all"
                    style={{
                      background: weather === w ? "var(--glass-strong-bg)" : "transparent",
                      opacity: weather === w ? 1 : 0.4,
                      touchAction: "manipulation",
                    }}
                  >{w}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Category (collapsible) ── */}
        <div className="glass p-4">
          <label className="block text-[10px] font-medium text-muted mb-3 uppercase tracking-wider">カテゴリ</label>

          <div className="grid grid-cols-5 gap-2">
            {visibleCats.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className="flex flex-col items-center gap-1 p-2.5 rounded-2xl text-xs transition-all active:scale-95"
                style={{
                  background: category === cat
                    ? "linear-gradient(135deg, var(--accent), var(--accent-dark))"
                    : "var(--glass-bg)",
                  color: category === cat ? "white" : "var(--text-secondary)",
                  boxShadow: category === cat ? "0 4px 16px var(--accent-glow)" : "none",
                  border: "1px solid var(--glass-border)",
                  touchAction: "manipulation",
                }}
              >
                <span className="text-xl">{CATEGORY_ICONS[cat]}</span>
                <span className="text-[9px] font-medium leading-tight text-center">{cat}</span>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {!showAllCats && SECONDARY_CATEGORIES.includes(category) && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[11px] mt-3 pb-1"
                style={{ color: "var(--accent)" }}
              >
                現在選択中: {CATEGORY_ICONS[category]} {category}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setShowAllCats((v) => !v)}
            className="mt-3 flex items-center gap-1.5 text-[12px] font-medium transition-opacity active:opacity-60"
            style={{ color: "var(--text-muted)", touchAction: "manipulation" }}
          >
            {showAllCats
              ? <><ChevronUp className="w-3.5 h-3.5" /> 折りたたむ</>
              : <><ChevronDown className="w-3.5 h-3.5" /> 他のカテゴリを見る（{SECONDARY_CATEGORIES.length}件）</>
            }
          </button>
        </div>

        {/* ── Content ── */}
        <div className="glass p-4">
          <label className="block text-[10px] font-medium text-muted mb-2 uppercase tracking-wider">本文</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`今日あったこと、感じたこと、気づいたこと...\n\n自由に書いてください。`}
            rows={8}
            className="w-full bg-transparent text-sm text-primary placeholder:text-muted resize-none leading-relaxed"
          />
        </div>

        {/* ── Image ── */}
        <div className="glass p-4">
          <label className="block text-[10px] font-medium text-muted mb-3 uppercase tracking-wider">写真</label>
          <AnimatePresence mode="wait">
            {imagePreview ? (
              <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
                <img src={imagePreview} alt="" className="w-full h-56 object-cover rounded-2xl opacity-90" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                  style={{ background: "rgba(0,0,0,0.6)", touchAction: "manipulation" }}
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </motion.div>
            ) : (
              <label key="upload" className="block cursor-pointer">
                <div
                  className="border-2 border-dashed rounded-2xl h-36 flex flex-col items-center justify-center gap-2 active:opacity-70 transition-opacity"
                  style={{ borderColor: "var(--glass-border)" }}
                >
                  <Camera className="w-6 h-6 text-muted" strokeWidth={1.5} />
                  <p className="text-xs text-muted">タップして写真を選択</p>
                  <p className="text-[10px] text-muted">JPG, PNG, HEIC対応</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs px-4 py-3 rounded-2xl"
              style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
            >{error}</motion.p>
          )}
        </AnimatePresence>

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl text-white font-semibold text-sm disabled:opacity-60 flex items-center justify-center gap-2 active:scale-98 transition-transform"
          style={{
            background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
            boxShadow: "0 4px 24px var(--accent-glow)",
            touchAction: "manipulation",
          }}
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> 保存中...</>
            : <><Check className="w-4 h-4" /> {isEdit ? "変更を保存" : "記録を保存"}</>
          }
        </button>

      </form>
    </motion.div>
  );
}
