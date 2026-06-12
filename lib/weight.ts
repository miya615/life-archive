export interface WeightRecord {
  id: string;
  weight: number;
  date: string;       // YYYY-MM-DD
  createdAt: string;  // ISO string
}

const LS_KEY = "weight_records";

export function getWeightRecords(): WeightRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveWeightRecord(weight: number, date: string): WeightRecord[] {
  const record: WeightRecord = {
    id: crypto.randomUUID(),
    weight: Math.round(weight * 10) / 10,
    date,
    createdAt: new Date().toISOString(),
  };
  const next = [...getWeightRecords(), record].sort(
    (a, b) => a.date.localeCompare(b.date),
  );
  localStorage.setItem(LS_KEY, JSON.stringify(next));
  return next;
}

export function getLatestRecord(records: WeightRecord[]): WeightRecord | null {
  if (records.length === 0) return null;
  return records.reduce((latest, r) => (r.date > latest.date ? r : latest));
}

export function fmtDate(dateStr: string): string {
  const [, m, d] = dateStr.split("-");
  return `${Number(m)}月${Number(d)}日`;
}
