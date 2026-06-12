"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { WeightInputForm } from "./WeightInputForm";
import { WeightChart } from "./WeightChart";

type Tab = "record" | "chart";

interface WeightModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function WeightModal({ open, onClose, onSaved }: WeightModalProps) {
  const [tab, setTab] = useState<Tab>("record");

  function handleSaved() {
    onSaved();
    setTab("chart");
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            key="wd-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(2px)" }}
            onClick={onClose}
          />

          {/* bottom sheet */}
          <motion.div
            key="wd-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320, mass: 0.9 }}
            className="fixed bottom-0 left-0 right-0 z-[61] flex flex-col"
            style={{
              background: "#F8FAFC",
              borderRadius: "28px 28px 0 0",
              maxHeight: "92dvh",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.14)",
              paddingBottom: "max(env(safe-area-inset-bottom, 0px), 24px)",
            }}
          >
            {/* drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full" style={{ background: "#CBD5E1" }} />
            </div>

            {/* header */}
            <div
              className="flex items-center justify-between flex-shrink-0"
              style={{ padding: "0 20px 12px" }}
            >
              <h2 className="text-[17px] font-bold" style={{ color: "#0F172A" }}>体重</h2>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full active:opacity-60 transition-opacity duration-100"
                style={{ background: "#E2E8F0", touchAction: "manipulation" }}
              >
                <X style={{ width: 16, height: 16, color: "#64748B" }} />
              </button>
            </div>

            {/* segmented control */}
            <div className="flex-shrink-0" style={{ padding: "0 20px 16px" }}>
              <div className="flex p-1 rounded-2xl" style={{ background: "#E2E8F0" }}>
                {(["record", "chart"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className="flex-1 py-2.5 text-[13px] font-semibold rounded-xl transition-all duration-150 active:opacity-70"
                    style={{
                      background: tab === t ? "#ffffff" : "transparent",
                      color: tab === t ? "#10B981" : "#64748B",
                      boxShadow: tab === t ? "0 1px 6px rgba(0,0,0,0.10)" : "none",
                      touchAction: "manipulation",
                    }}
                  >
                    {t === "record" ? "記録" : "グラフ"}
                  </button>
                ))}
              </div>
            </div>

            {/* scrollable content — padding applied here for all children */}
            <div
              className="flex-1 overflow-y-auto"
              style={{ padding: "0 20px 8px", overscrollBehavior: "contain" }}
            >
              {tab === "record" ? (
                <WeightInputForm onSaved={handleSaved} />
              ) : (
                <WeightChart onRequestRecord={() => setTab("record")} />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
