"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionValue, animate, usePresence } from "framer-motion";
import { X } from "lucide-react";
import { WeightInputForm } from "./WeightInputForm";
import { WeightChart } from "./WeightChart";

type Tab = "record" | "chart";

const CLOSE_THRESHOLD = 100; // px downward to trigger close

function WeightSheet({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [tab, setTab] = useState<Tab>("record");
  const [isPresent, safeToRemove] = usePresence();
  const sheetY = useMotionValue(600); // start below screen
  const isDragging = useRef(false);
  const startY = useRef(0);

  // Enter animation
  useEffect(() => {
    animate(sheetY, 0, { type: "spring", damping: 32, stiffness: 320, mass: 0.9 });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Exit animation (triggered by AnimatePresence removing from open=false)
  useEffect(() => {
    if (!isPresent) {
      animate(sheetY, 700, { duration: 0.22, ease: "easeIn" }).then(safeToRemove!);
    }
  }, [isPresent]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleDragStart(e: React.PointerEvent<HTMLDivElement>) {
    isDragging.current = true;
    startY.current = e.clientY - sheetY.get();
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handleDragMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return;
    const newY = Math.max(0, e.clientY - startY.current);
    sheetY.set(newY);
  }

  function handleDragEnd() {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (sheetY.get() >= CLOSE_THRESHOLD) {
      // animate out then close
      animate(sheetY, 700, { duration: 0.2, ease: "easeIn" }).then(() => onClose());
    } else {
      // snap back
      animate(sheetY, 0, { type: "spring", damping: 30, stiffness: 300 });
    }
  }

  function handleSaved() {
    onSaved();
    setTab("chart");
  }

  return (
    <motion.div
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
        paddingBottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
        y: sheetY,
      }}
    >
      {/* ── drag handle ── only this area triggers drag */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "12px 0 6px",
          touchAction: "none",
          cursor: "grab",
          flexShrink: 0,
          userSelect: "none",
        }}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
      >
        <div style={{ width: 44, height: 4, borderRadius: 999, background: "#CBD5E1" }} />
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
        <div style={{ display: "flex", padding: 4, borderRadius: 16, background: "#E2E8F0" }}>
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

      {/* scrollable content — touchAction: pan-y so native scroll works here */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "0 20px 16px",
        overscrollBehavior: "contain",
        touchAction: "pan-y",
      }}>
        {tab === "record" ? (
          <WeightInputForm onSaved={handleSaved} />
        ) : (
          <WeightChart onRequestRecord={() => setTab("record")} />
        )}
      </div>
    </motion.div>
  );
}

export function WeightModal({ open, onClose, onSaved }: {
  open: boolean; onClose: () => void; onSaved: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return createPortal(
    <>
      {/* backdrop */}
      <AnimatePresence>
        {open && (
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
        )}
      </AnimatePresence>

      {/* sheet — separate AnimatePresence so usePresence works in WeightSheet */}
      <AnimatePresence>
        {open && <WeightSheet key="wd-sheet" onClose={onClose} onSaved={onSaved} />}
      </AnimatePresence>
    </>,
    document.body,
  );
}
