import { EntriesContent } from "@/components/entries/EntriesContent";

// データ取得は EntriesContent (client) 側で行うため、このページは即時レンダリング
export default function EntriesPage() {
  return <EntriesContent />;
}
