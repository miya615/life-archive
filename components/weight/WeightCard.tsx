"use client";

import { useEffect, useState } from "react";
import { Scale, Plus } from "lucide-react";
import { getWeightRecords, getLatestRecord, fmtDate, type WeightRecord } from "@/lib/weight";
import { WeightModal } from "./WeightModal";

export function WeightCard() {
  const [latest, setLatest] = useState<WeightRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  function reload() {
    const records = getWeightRecords();
    setLatest(getLatestRecord(records));
  }

  useEffect(() => { reload(); }, []);

  return (
    <>
      <div
        className="rounded-[20px] overflow-hidden active:scale-[0.99] transition-transform duration-100"
        style={{
          background: "linear-gradient(135deg, #F0FDF8 0%, #ECFDF5 100%)",
          border: "1px solid rgba(16,185,129,0.14)",
          boxShadow: "0 4px 20px rgba(16,185,129,0.08)",
          touchAction: "manipulation",
          cursor: "pointer",
        }}
        onClick={() => setModalOpen(true)}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(16,185,129,0.13)" }}
              >
                <Scale style={{ width: 16, height: 16, color: "#10B981" }} strokeWidth={1.8} />
              </div>
              <span className="text-[13px] font-bold" style={{ color: "#065F46" }}>体重</span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
              className="w-7 h-7 flex items-center justify-center rounded-full active:opacity-70 transition-opacity duration-100"
              style={{ background: "#10B981", touchAction: "manipulation" }}
            >
              <Plus style={{ width: 14, height: 14, color: "#fff" }} strokeWidth={2.5} />
            </button>
          </div>

          <div className="mt-3">
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
              <p className="text-[18px] font-bold" style={{ color: "#94A3B8" }}>未記録</p>
            )}
          </div>
        </div>
      </div>

      <WeightModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={reload}
      />
    </>
  );
}
