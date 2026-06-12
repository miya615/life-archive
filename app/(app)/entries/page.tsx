export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { EntriesContent } from "@/components/entries/EntriesContent";

export default async function EntriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", user!.id)
    .order("entry_date", { ascending: false });

  return <EntriesContent entries={entries ?? []} />;
}
