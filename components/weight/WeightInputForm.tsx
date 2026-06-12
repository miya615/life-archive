"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { saveWeightRecord } from "@/lib/weight";

interface WeightInputFormProps {
  onSaved: () => void;
}

export function WeightInputForm({ onSaved }: WeightInputFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(today);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const w = parseFloat(weight);
    if (!weight || isNaN(w)) { setError("体重を入力してください"); return; }
    if (w <= 0 || w >= 300) { setError("正しい体重を入力してください（1〜299 kg）"); return; }
    if (!date) { setError("日付を入力してください"); return; }
    setError("");
    setSaving(true);
    try {
      await saveWeightRecord(w, date);
      setSaved(true);
      setTimeout(() => { setSaved(false); onSaved(); }, 900);
    } catch {
      setError("保存に失敗しました。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-[13px]" style={{ color: "#64748B" }}>
        今日の体重を入力してください。
      </p>

      {/* weight input */}
      <div>
        <label className="block text-[12px] font-semibold mb-2" style={{ color: "#374151" }}>
          体重
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            min="1"
            max="299"
            placeholder="52.4"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="flex-1 h-14 rounded-2xl text-center text-[22px] font-bold outline-none"
            style={{
              background: "#fff",
              border: "1.5px solid #D1FAE5",
              color: "#0F172A",
              boxShadow: "0 2px 8px rgba(16,185,129,0.07)",
            }}
          />
          <span className="text-[16px] font-medium flex-shrink-0" style={{ color: "#64748B" }}>kg</span>
        </div>
      </div>

      {/* date input */}
      <div>
        <label className="block text-[12px] font-semibold mb-2" style={{ color: "#374151" }}>
          日付
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full h-12 rounded-2xl px-4 text-[14px] font-medium outline-none"
          style={{
            background: "#fff",
            border: "1.5px solid #E2E8F0",
            color: "#0F172A",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        />
      </div>

      {error && (
        <p className="text-[12px] font-medium" style={{ color: "#EF4444" }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={saving || saved}
        className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-[15px] active:scale-[0.98] transition-transform duration-100 disabled:opacity-60"
        style={{
          background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
          boxShadow: "0 6px 20px rgba(16,185,129,0.25)",
          touchAction: "manipulation",
        }}
      >
        {saved ? (
          <><Check style={{ width: 18, height: 18 }} strokeWidth={2.5} /> 保存しました</>
        ) : saving ? (
          <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" />
        ) : "保存する"}
      </button>
    </form>
  );
}
