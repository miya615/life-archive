export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { NewEntryForm } from "@/components/entries/NewEntryForm";
import { notFound } from "next/navigation";

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: entry } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!entry) notFound();

  return <NewEntryForm editEntry={entry} />;
}
