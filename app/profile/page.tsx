export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileContent } from "@/components/entries/ProfileContent";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { count: totalEntries } = await supabase
    .from("entries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const { count: photoCount } = await supabase
    .from("entries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .not("image_url", "is", null);

  const { data: categoryStats } = await supabase
    .from("entries")
    .select("category")
    .eq("user_id", user!.id);

  const catMap: Record<string, number> = {};
  for (const row of categoryStats ?? []) {
    catMap[row.category] = (catMap[row.category] ?? 0) + 1;
  }

  return (
    <AppShell>
      <ProfileContent
        email={user!.email ?? ""}
        displayName={profile?.display_name ?? user!.email?.split("@")[0] ?? ""}
        avatarUrl={profile?.avatar_url ?? null}
        totalEntries={totalEntries ?? 0}
        photoCount={photoCount ?? 0}
        categoryStats={catMap}
        memberSince={profile?.created_at ?? user!.created_at}
      />
    </AppShell>
  );
}
