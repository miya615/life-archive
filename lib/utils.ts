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

const DAILY_QUOTES = [
  "未来の自分が読み返したくなる一文を残そう。",
  "記録することは、記憶に命を与えること。",
  "今日の小さな気づきが、10年後の宝物になる。",
  "人生は点の集まり。記録がそれを線につなぐ。",
  "過去を振り返ることで、未来が見えてくる。",
  "記録は、未来の自分への手紙。",
  "どんな些細なことも、あなたの人生の一部。",
  "今日を丁寧に生きた証を残そう。",
  "時間は流れるが、記録は残る。",
  "今日の感情は、明日には変わっているかもしれない。",
  "あなたの歴史は、あなただけが書ける。",
  "小さな記録が、大きな物語になる。",
];

export function getDailyQuote(date: Date = new Date()): string {
  const doy = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return DAILY_QUOTES[doy % DAILY_QUOTES.length];
}

export interface ReflectionData {
  oneYearAgo: Entry[];
  weekCount: number;
  weekTopCategories: { cat: string; count: number }[];
  quote: string;
}
