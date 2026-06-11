"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Category, CATEGORIES, CATEGORY_ICONS } from "@/lib/types";

export function NewEntryForm({ editEntry }: { editEntry?: {
  id: string;
  title: string;
  content: string | null;
  category: Category;
  entry_date: string;
  image_url: string | null;
} }) {
  const router = useRouter();
  const isEdit = !!editEntry;
  const [title, setTitle] = useState(editEntry?.title ?? "");
  const [content, setContent] = useState(editEntry?.content ?? "");
  const [category, setCategory] = useState<Category>(editEntry?.category ?? "日常");
  const [entryDate, setEntryDate] = useState(
    editEntry?.entry_date ?? new Date().toISOString().split("T")[0]
  );
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
    if (!title.trim()) {
      setError("タイトルを入力してください");
      return;
    }
    setLoading(true);
    setError("");
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth"); return; }

    let imageUrl = editEntry?.image_url ?? null;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("entry-images")
        .upload(path, imageFile, { upsert: true });
      if (uploadError) {
        setError("画像のアップロードに失敗しました");
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from("entry-images")
        .getPublicUrl(path);
      imageUrl = urlData.publicUrl;
    }

    if (isEdit) {
      const { error: updateError } = await supabase
        .from("entries")
        .update({ title, content, category, entry_date: entryDate, image_url: imageUrl, updated_at: new Date().toISOString() })
        .eq("id", editEntry!.id);
      if (updateError) { setError(updateError.message); setLoading(false); return; }
      router.push(`/entries/${editEntry!.id}`);
    } else {
      const { error: insertError } = await supabase.from("entries").insert({
        user_id: user.id, title, content, category, entry_date: entryDate, image_url: imageUrl,
      });
      if (insertError) { setError(insertError.message); setLoading(false); return; }
      router.push("/entries");
    }
  }

  return (
    <div className="py-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="w-9 h-9 glass rounded-2xl flex items-center justify-center shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-800">{isEdit ? "記録を編集" : "新しい記録"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date */}
        <div className="glass rounded-2xl p-4 shadow-sm">
          <label className="block text-xs font-medium text-gray-500 mb-2">日付</label>
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-gray-800"
          />
        </div>

        {/* Title */}
        <div className="glass rounded-2xl p-4 shadow-sm">
          <label className="block text-xs font-medium text-gray-500 mb-2">タイトル *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="記録のタイトル"
            className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* Category */}
        <div className="glass rounded-2xl p-4 shadow-sm">
          <label className="block text-xs font-medium text-gray-500 mb-3">カテゴリ</label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl text-xs transition-all ${
                  category === cat
                    ? "bg-indigo-500 text-white shadow-md shadow-indigo-200"
                    : "bg-white/50 text-gray-600"
                }`}
              >
                <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
                <span className="text-[10px] font-medium leading-tight text-center">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="glass rounded-2xl p-4 shadow-sm">
          <label className="block text-xs font-medium text-gray-500 mb-2">本文</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="今日あったこと、感じたこと、気づいたこと..."
            rows={5}
            className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none"
          />
        </div>

        {/* Image */}
        <div className="glass rounded-2xl p-4 shadow-sm">
          <label className="block text-xs font-medium text-gray-500 mb-3">写真</label>
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="" className="w-full h-48 object-cover rounded-xl" />
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label className="block">
              <div className="border-2 border-dashed border-gray-200 rounded-xl h-32 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-300 transition-colors">
                <span className="text-2xl">📷</span>
                <span className="text-xs text-gray-400">タップして写真を選択</span>
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:opacity-60"
        >
          {loading ? "保存中..." : isEdit ? "変更を保存" : "記録を保存"}
        </button>
      </form>
    </div>
  );
}
