"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, NotebookPen } from "lucide-react";

const LS_KEY = "daily_memo";

function loadMemo(): string {
  if (typeof window === "undefined") return "";
  try { return localStorage.getItem(LS_KEY) ?? ""; } catch { return ""; }
}

function saveMemo(text: string) {
  try { localStorage.setItem(LS_KEY, text); } catch { /* noop */ }
}

export function MemoCard() {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setText(loadMemo());
  }, []);

  function handleSave() {
    if (busy) return;
    setBusy(true);
    saveMemo(text);
    setSaved(true);
    timerRef.current = setTimeout(() => {
      setSaved(false);
      setBusy(false);
    }, 1200);
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div
      className="rounded-[20px] overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(135deg, #FFFCF7 0%, #FFF8EE 100%)",
        border: "1px solid rgba(210, 175, 120, 0.22)",
        boxShadow: "0 4px 20px rgba(180, 130, 70, 0.08)",
      }}
    >
      <div className="p-4 flex flex-col gap-2.5 h-full">
        {/* header */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(210, 160, 80, 0.12)" }}
          >
            <NotebookPen style={{ width: 15, height: 15, color: "#B07D30" }} strokeWidth={1.8} />
          </div>
          <p className="text-[13px] font-bold leading-none" style={{ color: "#6B4F30" }}>メモ</p>
        </div>

        {/* textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder=""
          rows={3}
          className="w-full resize-none rounded-2xl text-[13px] leading-relaxed outline-none flex-1"
          style={{
            background: "rgba(255,255,255,0.70)",
            border: "1px solid rgba(210, 175, 120, 0.18)",
            padding: "8px 10px",
            color: "#1E293B",
            minHeight: 64,
          }}
        />

        {/* save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={busy}
          className="w-full flex items-center justify-center gap-1.5 rounded-full text-[12px] font-semibold py-1.5 transition-all duration-100 active:scale-[0.97] disabled:opacity-70"
          style={{
            background: saved
              ? "linear-gradient(135deg, #059669 0%, #10B981 100%)"
              : "linear-gradient(135deg, #C8853A 0%, #D4944A 100%)",
            color: "#fff",
            boxShadow: saved
              ? "0 4px 14px rgba(16,185,129,0.22)"
              : "0 4px 14px rgba(180, 120, 50, 0.22)",
            touchAction: "manipulation",
          }}
        >
          {busy && saved ? (
            <><Check style={{ width: 13, height: 13 }} strokeWidth={2.5} /> 保存しました</>
          ) : busy ? (
            <Loader2 style={{ width: 13, height: 13 }} className="animate-spin" />
          ) : (
            "保存する"
          )}
        </button>
      </div>
    </div>
  );
}
