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
