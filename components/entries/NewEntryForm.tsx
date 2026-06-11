"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, X, Loader2, Check } from "lucide-react";
import { Category, CATEGORIES, CATEGORY_ICONS } from "@/lib/types";

const EMOTIONS = ["😊", "😢", "😤", "😌", "🤔", "🔥", "😴", "🥳"];
const WEATHERS = ["☀️", "⛅", "🌧️", "❄️", "🌙", "🌈"];

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
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
          onClick={() => router.back()}
          className="w-9 h-9 glass rounded-2xl flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-secondary" strokeWidth={2} />
        </motion.button>
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-primary">{isEdit ? "記録を編集" : "新しい記録"}</h1>
          <p className="text-xs text-muted mt-0.5">あなたの1ページを残しましょう</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date + emotion + weather row */}
        <div className="glass p-4 space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[120px]">
              <label className="block text-[10px] font-medium text-muted mb-1.5 uppercase tracking-wider">日付</label>
              <input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-muted mb-1.5 uppercase tracking-wider">気分</label>
              <div className="flex gap-1.5 flex-wrap">
                {EMOTIONS.map((em) => (
                  <motion.button key={em} type="button" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setEmotion(em)}
                    className="text-lg rounded-xl p-1 transition-all"
                    style={{ background: emotion === em ? "var(--glass-strong-bg)" : "transparent", opacity: emotion === em ? 1 : 0.45 }}
                  >{em}</motion.button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-muted mb-1.5 uppercase tracking-wider">天気</label>
              <div className="flex gap-1.5">
                {WEATHERS.map((w) => (
                  <motion.button key={w} type="button" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setWeather(w)}
                    className="text-lg rounded-xl p-1 transition-all"
                    style={{ background: weather === w ? "var(--glass-strong-bg)" : "transparent", opacity: weather === w ? 1 : 0.45 }}
                  >{w}</motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="glass p-4">
          <label className="block text-[10px] font-medium text-muted mb-2 uppercase tracking-wider">タイトル *</label>
          <input
            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="この記録のタイトル"
            className="w-full bg-transparent text-base lg:text-lg font-semibold text-primary placeholder:text-muted placeholder:font-normal"
          />
        </div>

        {/* Category */}
        <div className="glass p-4">
          <label className="block text-[10px] font-medium text-muted mb-3 uppercase tracking-wider">カテゴリ</label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat} type="button"
                whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                onClick={() => setCategory(cat)}
                className="flex flex-col items-center gap-1 p-2 rounded-2xl text-xs transition-all"
                style={{
                  background: category === cat ? "linear-gradient(135deg, var(--accent), var(--accent-dark))" : "var(--glass-bg)",
                  color: category === cat ? "white" : "var(--text-secondary)",
                  boxShadow: category === cat ? "0 4px 16px var(--accent-glow)" : "none",
                }}
              >
                <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
                <span className="text-[9px] font-medium leading-tight text-center">{cat}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="glass p-4">
          <label className="block text-[10px] font-medium text-muted mb-2 uppercase tracking-wider">本文</label>
          <textarea
            value={content} onChange={(e) => setContent(e.target.value)}
            placeholder={`今日あったこと、感じたこと、気づいたこと...\n\nNotionのように自由に書いてください。`}
            rows={8}
            className="w-full bg-transparent text-sm text-primary placeholder:text-muted resize-none leading-relaxed"
          />
        </div>

        {/* Image */}
        <div className="glass p-4">
          <label className="block text-[10px] font-medium text-muted mb-3 uppercase tracking-wider">写真</label>
          <AnimatePresence mode="wait">
            {imagePreview ? (
              <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
                <img src={imagePreview} alt="" className="w-full h-56 object-cover rounded-2xl opacity-90" />
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.6)" }}
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.label key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="block cursor-pointer">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="border-2 border-dashed rounded-2xl h-36 flex flex-col items-center justify-center gap-2"
                  style={{ borderColor: "var(--glass-border)" }}
                >
                  <Camera className="w-6 h-6 text-muted" strokeWidth={1.5} />
                  <p className="text-xs text-muted">タップして写真を選択</p>
                  <p className="text-[10px] text-muted">JPG, PNG, HEIC対応</p>
                </motion.div>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </motion.label>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="text-xs px-4 py-3 rounded-2xl"
              style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
            >{error}</motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          type="submit" disabled={loading}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl text-white font-semibold text-sm disabled:opacity-60 flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
            boxShadow: "0 4px 24px var(--accent-glow)",
          }}
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> 保存中...</> : <><Check className="w-4 h-4" /> {isEdit ? "変更を保存" : "記録を保存"}</>}
        </motion.button>
      </form>
    </motion.div>
  );
}
