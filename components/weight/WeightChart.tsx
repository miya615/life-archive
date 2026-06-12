"use client";

import { useEffect, useState } from "react";
import { Scale } from "lucide-react";
import { getWeightRecords, sortByDateAsc, fmtDate, type WeightRecord } from "@/lib/weight";

const W = 320;
const H = 180;
const PAD = { top: 20, right: 16, bottom: 36, left: 44 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;

function buildChart(records: WeightRecord[]) {
  if (records.length === 0) return null;
  const weights = records.map((r) => r.weight);
  const rawMin = Math.min(...weights);
  const rawMax = Math.max(...weights);
  const spread = rawMax - rawMin;
  const pad = spread < 2 ? 1.5 : spread * 0.15;
  const yMin = rawMin - pad;
  const yMax = rawMax + pad;

  function xPos(i: number) {
    if (records.length === 1) return PAD.left + INNER_W / 2;
    return PAD.left + (i / (records.length - 1)) * INNER_W;
  }
  function yPos(w: number) {
    return PAD.top + INNER_H - ((w - yMin) / (yMax - yMin)) * INNER_H;
  }

  const points = records.map((r, i) => ({ x: xPos(i), y: yPos(r.weight), record: r }));
  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  // y-axis labels: 4 ticks
  const yTicks = Array.from({ length: 4 }, (_, i) => {
    const val = yMin + (i / 3) * (yMax - yMin);
    return { y: PAD.top + INNER_H - (i / 3) * INNER_H, val };
  });

  // x-axis labels: show up to 5 evenly spaced
  const xStep = Math.max(1, Math.floor(records.length / 5));
  const xLabels = records
    .map((r, i) => ({ i, date: r.date }))
    .filter((_, i) => i % xStep === 0 || i === records.length - 1)
    .slice(-6);

  return { points, polyline, yTicks, xLabels, xPos };
}

export function WeightChart({ onRequestRecord }: { onRequestRecord: () => void }) {
  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    getWeightRecords().then((data) => {
      if (mounted) { setRecords(sortByDateAsc(data)); setLoading(false); }
    });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return <div className="h-48 rounded-2xl animate-pulse" style={{ background: "#E2E8F0" }} />;
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4"
          style={{ background: "linear-gradient(135deg, #ECFDF5, #E0F2FE)" }}>
          <Scale style={{ width: 28, height: 28, color: "#10B981" }} strokeWidth={1.5} />
        </div>
        <p className="text-[15px] font-semibold mb-1" style={{ color: "#374151" }}>
          まだ体重の記録がありません
        </p>
        <p className="text-[12px] mb-6" style={{ color: "#94A3B8" }}>
          最初の体重を記録すると、ここにグラフが表示されます。
        </p>
        <button
          type="button"
          onClick={onRequestRecord}
          className="px-6 py-3 rounded-2xl text-white text-[13px] font-bold active:scale-[0.97] transition-transform duration-100"
          style={{
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
            touchAction: "manipulation",
          }}
        >
          体重を記録する
        </button>
      </div>
    );
  }

  const chart = buildChart(records);
  if (!chart) return null;
  const { points, polyline, yTicks, xLabels, xPos } = chart;

  return (
    <div className="space-y-4">
      {/* chart card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          padding: "16px 4px 8px 4px",
        }}
      >
        <p className="text-[12px] font-semibold px-4 mb-2" style={{ color: "#374151" }}>体重の推移</p>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: "100%", height: "auto", display: "block" }}
          aria-hidden="true"
        >
          {/* grid lines */}
          {yTicks.map((t, i) => (
            <line
              key={i}
              x1={PAD.left} y1={t.y}
              x2={PAD.left + INNER_W} y2={t.y}
              stroke="#E2E8F0" strokeWidth="1"
            />
          ))}

          {/* y labels */}
          {yTicks.map((t, i) => (
            <text
              key={i}
              x={PAD.left - 6} y={t.y + 4}
              textAnchor="end"
              fontSize={9}
              fill="#94A3B8"
            >
              {t.val.toFixed(1)}
            </text>
          ))}

          {/* x labels */}
          {xLabels.map(({ i, date }) => {
            const [, m, d] = date.split("-");
            return (
              <text
                key={i}
                x={xPos(i)} y={H - 4}
                textAnchor="middle"
                fontSize={9}
                fill="#94A3B8"
              >
                {`${Number(m)}/${Number(d)}`}
              </text>
            );
          })}

          {/* area fill */}
          <defs>
            <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>
          </defs>
          {records.length > 1 && (
            <polygon
              points={`${points.map((p) => `${p.x},${p.y}`).join(" ")} ${points[points.length - 1].x},${PAD.top + INNER_H} ${points[0].x},${PAD.top + INNER_H}`}
              fill="url(#wg)"
            />
          )}

          {/* line */}
          <polyline
            points={polyline}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* dots */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x} cy={p.y} r={activeIdx === i ? 6 : 4}
              fill={activeIdx === i ? "#059669" : "#10B981"}
              stroke="#fff" strokeWidth="2"
              style={{ cursor: "pointer" }}
              onClick={() => setActiveIdx(activeIdx === i ? null : i)}
            />
          ))}

          {/* tooltip */}
          {activeIdx !== null && (() => {
            const p = points[activeIdx];
            const r = p.record;
            const bx = Math.min(Math.max(p.x - 32, PAD.left), PAD.left + INNER_W - 72);
            const by = p.y > PAD.top + 30 ? p.y - 38 : p.y + 12;
            return (
              <g>
                <rect x={bx} y={by} width={72} height={26} rx={6} fill="#0F172A" opacity={0.88} />
                <text x={bx + 36} y={by + 11} textAnchor="middle" fontSize={9} fill="#fff">
                  {fmtDate(r.date)}
                </text>
                <text x={bx + 36} y={by + 22} textAnchor="middle" fontSize={10} fill="#6EE7B7" fontWeight="bold">
                  {r.weight.toFixed(1)} kg
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* history list */}
      <div>
        <p className="text-[12px] font-semibold mb-2" style={{ color: "#374151" }}>記録一覧</p>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "#fff", border: "1px solid #E2E8F0", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
        >
          {[...records].reverse().map((r, i, arr) => (
            <div
              key={r.id}
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none" }}
            >
              <span className="text-[13px]" style={{ color: "#64748B" }}>{fmtDate(r.date)}</span>
              <span className="text-[14px] font-bold" style={{ color: "#0F172A" }}>
                {r.weight.toFixed(1)} kg
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
