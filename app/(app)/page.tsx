export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { HomeContent } from "@/components/entries/HomeContent";
import { getDailyQuote } from "@/lib/utils";

function pad(n: number) { return String(n).padStart(2, "0"); }

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const thisYear = now.getFullYear();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split("T")[0];

  const [
    { data: recentEntries },
    { count: monthCount },
    { count: todayCount },
    { data: profile },
    { data: oneYearAgo },
    { count: weekCount },
    { data: weekEntries },
  ] = await Promise.all([
    supabase.from("entries").select("*").eq("user_id", user!.id).order("entry_date", { ascending: false }).limit(10),
    supabase.from("entries").select("*", { count: "exact", head: true }).eq("user_id", user!.id).gte("entry_date", startOfMonth),
    supabase.from("entries").select("*", { count: "exact", head: true }).eq("user_id", user!.id).eq("entry_date", today),
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
    supabase.from("entries").select("*").eq("user_id", user!.id).like("entry_date", `%-${mm}-${dd}`).neq("entry_date", `${thisYear}-${mm}-${dd}`).order("entry_date", { ascending: false }).limit(2),
    supabase.from("entries").select("*", { count: "exact", head: true }).eq("user_id", user!.id).gte("entry_date", weekAgoStr),
    supabase.from("entries").select("category").eq("user_id", user!.id).gte("entry_date", weekAgoStr),
  ]);

  const catMap: Record<string, number> = {};
  for (const r of weekEntries ?? []) {
    catMap[r.category] = (catMap[r.category] ?? 0) + 1;
  }
  const weekTopCategories = Object.entries(catMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([cat, count]) => ({ cat, count }));

  return (
    <HomeContent
      entries={recentEntries ?? []}
      monthCount={monthCount ?? 0}
      todayCount={todayCount ?? 0}
      displayName={profile?.display_name ?? user!.email?.split("@")[0] ?? ""}
      reflection={{
        oneYearAgo: oneYearAgo ?? [],
        weekCount: weekCount ?? 0,
        weekTopCategories,
        quote: getDailyQuote(now),
      }}
    />
  );
}
