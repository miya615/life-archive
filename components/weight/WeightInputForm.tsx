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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const w = parseFloat(weight);
    if (!weight.trim()) { setError("体重を入力してください"); return; }
    if (isNaN(w)) { setError("正しい体重を入力してください"); return; }
    if (w <= 0) { setError("体重は 0 kg より大きい値で入力してください"); return; }
    if (w >= 300) { setError("体重は 300 kg 未満で入力してください"); return; }
    if (!date) { setError("日付を入力してください"); return; }

    setSaving(true);
    try {
      saveWeightRecord(w, date);
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

      {/* weight */}
      <div>
        <label className="block text-[12px] font-semibold mb-2" style={{ color: "#374151" }}>
          体重
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0.1"
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

      {/* date */}
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

      {/* error */}
      {error && (
        <p className="text-[12px] font-medium" style={{ color: "#EF4444" }}>{error}</p>
      )}

      {/* CTA button */}
      <button
        type="submit"
        disabled={saving || saved}
        className="w-full flex items-center justify-center gap-2 font-bold text-[15px] text-white active:scale-[0.98] transition-transform duration-100 disabled:opacity-60"
        style={{
          height: 52,
          borderRadius: 999,
          background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
          boxShadow: "0 12px 30px rgba(16,185,129,0.25)",
          touchAction: "manipulation",
        }}
      >
        {saved ? (
          <><Check style={{ width: 18, height: 18 }} strokeWidth={2.5} /> 記録しました</>
        ) : saving ? (
          <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" />
        ) : "決定"}
      </button>
    </form>
  );
}
