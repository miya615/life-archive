export default function EntriesLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="h-8 w-28 rounded-2xl bg-slate-100" />
          <div className="h-4 w-16 rounded-full bg-slate-100" />
        </div>
        <div className="h-11 w-24 rounded-2xl bg-slate-100" />
      </div>

      {/* Search + filter button row */}
      <div className="flex items-center gap-3">
        <div className="h-12 flex-1 rounded-full bg-slate-100" />
        <div className="h-12 w-12 flex-shrink-0 rounded-full bg-slate-100" />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-[20px] bg-slate-100" style={{ height: 160 }} />
        ))}
      </div>
    </div>
  );
}
