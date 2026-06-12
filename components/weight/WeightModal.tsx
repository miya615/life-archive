"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

function WeightSheet({ onClose, onSaved }: Omit<WeightModalProps, "open">) {
  const [tab, setTab] = useState<Tab>("record");

  function handleSaved() {
    onSaved();
    setTab("chart");
  }

  return (
    <>
      {/* backdrop — full screen, above everything */}
      <motion.div
        key="wd-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        style={{
          position: "fixed", inset: 0,
          zIndex: 9998,
          background: "rgba(15,23,42,0.45)",
          backdropFilter: "blur(2px)",
        }}
        onClick={onClose}
      />

      {/* bottom sheet — above backdrop and BottomNav */}
      <motion.div
        key="wd-sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 320, mass: 0.9 }}
        style={{
          position: "fixed",
          left: 0, right: 0, bottom: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          background: "#F8FAFC",
          borderRadius: "28px 28px 0 0",
          maxHeight: "92dvh",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.14)",
          /* account for BottomNav (~56px) + safe area */
          paddingBottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {/* drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: "#CBD5E1" }} />
        </div>

        {/* header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px 12px", flexShrink: 0,
        }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", margin: 0 }}>体重</h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 999, background: "#E2E8F0",
              border: "none", cursor: "pointer", touchAction: "manipulation",
            }}
          >
            <X style={{ width: 16, height: 16, color: "#64748B" }} />
          </button>
        </div>

        {/* segmented control */}
        <div style={{ padding: "0 20px 16px", flexShrink: 0 }}>
          <div style={{
            display: "flex", padding: 4, borderRadius: 16,
            background: "#E2E8F0",
          }}>
            {(["record", "chart"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: "10px 0",
                  fontSize: 13, fontWeight: 600, borderRadius: 12,
                  border: "none", cursor: "pointer",
                  background: tab === t ? "#ffffff" : "transparent",
                  color: tab === t ? "#10B981" : "#64748B",
                  boxShadow: tab === t ? "0 1px 6px rgba(0,0,0,0.10)" : "none",
                  transition: "all 0.15s",
                  touchAction: "manipulation",
                }}
              >
                {t === "record" ? "記録" : "グラフ"}
              </button>
            ))}
          </div>
        </div>

        {/* scrollable content */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 20px 16px",
          overscrollBehavior: "contain",
        }}>
          {tab === "record" ? (
            <WeightInputForm onSaved={handleSaved} />
          ) : (
            <WeightChart onRequestRecord={() => setTab("record")} />
          )}
        </div>
      </motion.div>
    </>
  );
}

export function WeightModal({ open, onClose, onSaved }: WeightModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && <WeightSheet onClose={onClose} onSaved={onSaved} />}
    </AnimatePresence>,
    document.body,
  );
}
