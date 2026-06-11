export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { HomeContent } from "@/components/entries/HomeContent";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const { data: recentEntries } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", user!.id)
    .order("entry_date", { ascending: false })
    .limit(5);

  const { count: monthCount } = await supabase
    .from("entries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .gte("entry_date", startOfMonth);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <AppShell>
      <HomeContent
        entries={recentEntries ?? []}
        monthCount={monthCount ?? 0}
        displayName={profile?.display_name ?? user!.email?.split("@")[0] ?? ""}
      />
    </AppShell>
  );
}
