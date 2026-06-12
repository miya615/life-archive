import type { Entry } from "./types";

/** 日付を "6月11日(木)" 形式にフォーマット */
export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    month: "short", day: "numeric", weekday: "short",
  });
}

/** カテゴリ別の薄いパステルグラデーション (白背景向け) */
export const CAT_GRADIENTS: Record<string, string> = {
  思い出:  "linear-gradient(135deg, rgba(139,92,246,0.13) 0%, rgba(59,130,246,0.09) 100%)",
  健康:    "linear-gradient(135deg, rgba(16,185,129,0.13) 0%, rgba(6,182,212,0.09) 100%)",
  仕事:    "linear-gradient(135deg, rgba(59,130,246,0.13) 0%, rgba(99,102,241,0.09) 100%)",
  学習:    "linear-gradient(135deg, rgba(14,165,233,0.13) 0%, rgba(59,130,246,0.09) 100%)",
  お金:    "linear-gradient(135deg, rgba(245,158,11,0.13) 0%, rgba(234,179,8,0.09) 100%)",
  人間関係:"linear-gradient(135deg, rgba(239,68,68,0.13) 0%, rgba(236,72,153,0.09) 100%)",
  アイデア:"linear-gradient(135deg, rgba(168,85,247,0.13) 0%, rgba(236,72,153,0.09) 100%)",
  日常:    "linear-gradient(135deg, rgba(14,165,233,0.13) 0%, rgba(59,130,246,0.09) 100%)",
};

export interface ReflectionData {
  oneYearAgo: Entry[];
}
