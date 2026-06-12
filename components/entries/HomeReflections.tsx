"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { CATEGORY_ICONS } from "@/lib/types";
import type { ReflectionData } from "@/lib/utils";

export function HomeReflections({ data }: { data: ReflectionData }) {
  if (data.oneYearAgo.length === 0) return null;

  return (
    <div className="mt-2">
      <div className="glass p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles style={{ width: 13, height: 13, color: "var(--accent)" }} strokeWidth={1.8} />
            <p className="text-[13px] font-semibold text-secondary">1年前の今日</p>
          </div>
          <Link href="/timeline"
            className="text-[11px] flex items-center gap-1 active:opacity-60 transition-opacity duration-100"
            style={{ color: "var(--accent)", touchAction: "manipulation" }}>
            もっと見る <ArrowRight style={{ width: 10, height: 10 }} />
          </Link>
        </div>
        <div className="space-y-2.5">
          {data.oneYearAgo.map((entry) => (
            <Link key={entry.id} href={`/entries/${entry.id}`}
              className="flex items-start gap-3 p-3 rounded-xl active:scale-[0.98] active:opacity-80 transition-transform duration-100 block"
              style={{ background: "var(--glass-bg)", touchAction: "manipulation" }}
            >
              <span className="text-lg flex-shrink-0 mt-0.5">{CATEGORY_ICONS[entry.category]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-primary truncate">{entry.title}</p>
                <p className="text-[10px] text-muted mt-0.5">
                  {new Date(entry.entry_date).getFullYear()}年 · {entry.category}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
