export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { HomeContent } from "@/components/entries/HomeContent";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];

  const [
    { data: recentEntries },
    { count: monthCount },
    { count: todayCount },
    { data: profile },
  ] = await Promise.all([
    supabase.from("entries").select("*").eq("user_id", user!.id).order("entry_date", { ascending: false }).limit(10),
    supabase.from("entries").select("*", { count: "exact", head: true }).eq("user_id", user!.id).gte("entry_date", startOfMonth),
    supabase.from("entries").select("*", { count: "exact", head: true }).eq("user_id", user!.id).eq("entry_date", today),
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
  ]);

  return (
    <HomeContent
      entries={recentEntries ?? []}
      monthCount={monthCount ?? 0}
      todayCount={todayCount ?? 0}
      displayName={profile?.display_name ?? user!.email?.split("@")[0] ?? ""}
    />
  );
}
