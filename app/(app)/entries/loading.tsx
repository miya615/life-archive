export default function EntriesLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="h-8 w-28 rounded-2xl bg-slate-100" />
          <div className="h-4 w-16 rounded-full bg-slate-100" />
        </div>
        <div className="h-11 w-11 rounded-2xl bg-slate-100" />
      </div>

      {/* Search bar */}
      <div className="h-12 w-[92%] max-w-[400px] rounded-full bg-slate-100" />

      {/* Category chips */}
      <div className="flex gap-2.5 overflow-hidden">
        {[60, 52, 56, 64, 52, 56, 68, 52].map((w, i) => (
          <div key={i} className="h-11 flex-shrink-0 rounded-full bg-slate-100" style={{ width: w }} />
        ))}
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
