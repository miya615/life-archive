import { createClient } from "@/lib/supabase/client";

export interface WeightRecord {
  id: string;
  user_id: string;
  weight: number;
  date: string; // YYYY-MM-DD
  created_at: string;
}

export async function getWeightRecords(): Promise<WeightRecord[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("weight_records")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });
  return data ?? [];
}

export async function saveWeightRecord(weight: number, date: string): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("未ログイン");
  const { error } = await supabase.from("weight_records").insert({ user_id: user.id, weight, date });
  if (error) throw error;
}

export function sortByDateAsc(records: WeightRecord[]): WeightRecord[] {
  return [...records].sort((a, b) => a.date.localeCompare(b.date));
}

export function getLatestRecord(records: WeightRecord[]): WeightRecord | null {
  if (records.length === 0) return null;
  return records.reduce((latest, r) => (r.date > latest.date ? r : latest));
}

export function fmtDate(dateStr: string): string {
  const [, m, d] = dateStr.split("-");
  return `${Number(m)}月${Number(d)}日`;
}
