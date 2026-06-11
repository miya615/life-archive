export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { TimelineContent } from "@/components/entries/TimelineContent";

export default async function TimelinePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", user!.id)
    .order("entry_date", { ascending: false });

  return (
    <AppShell>
      <TimelineContent entries={entries ?? []} />
    </AppShell>
  );
}
