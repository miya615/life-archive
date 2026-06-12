export type Category =
  | "日常"
  | "健康"
  | "仕事"
  | "学習"
  | "お金"
  | "人間関係"
  | "アイデア"
  | "思い出";

export const CATEGORIES: Category[] = [
  "日常",
  "健康",
  "仕事",
  "学習",
  "お金",
  "人間関係",
  "アイデア",
  "思い出",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  日常: "bg-sky-100 text-sky-700",
  健康: "bg-emerald-100 text-emerald-700",
  仕事: "bg-indigo-100 text-indigo-700",
  学習: "bg-violet-100 text-violet-700",
  お金: "bg-amber-100 text-amber-700",
  人間関係: "bg-rose-100 text-rose-700",
  アイデア: "bg-orange-100 text-orange-700",
  思い出: "bg-pink-100 text-pink-700",
};

export interface CardStyle {
  bg: string;
  accent: string;
  labelColor: string;
  borderColor: string;
}

export const CARD_STYLES: Record<Category, CardStyle> = {
  日常:    { bg: "#EFF8FF", accent: "#0EA5E9", labelColor: "#0369A1", borderColor: "#BAE6FD" },
  健康:    { bg: "#ECFDF5", accent: "#10B981", labelColor: "#065F46", borderColor: "#A7F3D0" },
  仕事:    { bg: "#EEF2FF", accent: "#3B82F6", labelColor: "#1E40AF", borderColor: "#BFDBFE" },
  学習:    { bg: "#F5F3FF", accent: "#8B5CF6", labelColor: "#5B21B6", borderColor: "#DDD6FE" },
  お金:    { bg: "#FFFBEB", accent: "#F59E0B", labelColor: "#B45309", borderColor: "#FCD34D" },
  人間関係:{ bg: "#FFF1F2", accent: "#F43F5E", labelColor: "#9F1239", borderColor: "#FECDD3" },
  アイデア:{ bg: "#FFF7ED", accent: "#F97316", labelColor: "#C2410C", borderColor: "#FED7AA" },
  思い出:  { bg: "#FDF4FF", accent: "#A855F7", labelColor: "#6B21A8", borderColor: "#E9D5FF" },
};

export const CATEGORY_ICONS: Record<Category, string> = {
  日常: "☀️",
  健康: "💚",
  仕事: "💼",
  学習: "📚",
  お金: "💰",
  人間関係: "🤝",
  アイデア: "💡",
  思い出: "📷",
};

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Entry {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  category: Category;
  entry_date: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}
