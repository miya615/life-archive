"use client";

import { useEffect, useState } from "react";
import { Scale } from "lucide-react";
import { getWeightRecords, getLatestRecord, fmtDate, type WeightRecord } from "@/lib/weight";
import { WeightModal } from "./WeightModal";

export function WeightCard() {
  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    const data = await getWeightRecords();
    setRecords(data);
  }

  useEffect(() => { load(); }, []);

  const latest = getLatestRecord(records);

  return (
    <>
      <div
        className="rounded-[20px] overflow-hidden active:scale-[0.99] transition-transform duration-100"
        style={{
          background: "linear-gradient(135deg, #ECFDF5 0%, #E0F2FE 100%)",
          border: "1px solid rgba(16,185,129,0.18)",
          boxShadow: "0 4px 20px rgba(16,185,129,0.10)",
          touchAction: "manipulation",
          cursor: "pointer",
        }}
        onClick={() => setModalOpen(true)}
      >
        <div className="p-5">
          {/* header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(16,185,129,0.13)" }}
              >
                <Scale style={{ width: 18, height: 18, color: "#10B981" }} strokeWidth={1.8} />
              </div>
              <span className="text-[13px] font-bold" style={{ color: "#065F46" }}>体重</span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-full active:opacity-70 transition-opacity duration-100"
              style={{
                background: "#10B981",
                color: "#fff",
                touchAction: "manipulation",
              }}
            >
              体重を記録
            </button>
          </div>

          {/* value */}
          <div className="mt-4">
            {latest ? (
              <>
                <div className="flex items-baseline gap-1">
                  <span className="text-[30px] font-bold leading-none" style={{ color: "#0F172A" }}>
                    {latest.weight.toFixed(1)}
                  </span>
                  <span className="text-[14px] font-medium" style={{ color: "#64748B" }}>kg</span>
                </div>
                <p className="text-[11px] mt-1" style={{ color: "#64748B" }}>
                  最終記録：{fmtDate(latest.date)}
                </p>
              </>
            ) : (
              <>
                <p className="text-[18px] font-bold" style={{ color: "#94A3B8" }}>未記録</p>
                <p className="text-[11px] mt-1" style={{ color: "#64748B" }}>今日の体重を記録しましょう</p>
              </>
            )}
          </div>
        </div>
      </div>

      <WeightModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
      />
    </>
  );
}
