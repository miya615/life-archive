export default function TimelineLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-28 rounded-2xl bg-slate-100" />
        <div className="h-4 w-40 rounded-full bg-slate-100" />
      </div>

      {/* Year block */}
      <div className="space-y-4">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 flex-shrink-0" />
          <div className="flex-1 h-px bg-slate-100" />
        </div>
        <div className="ml-10 space-y-3">
          <div className="h-4 w-12 rounded-full bg-slate-100" />
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-[20px] bg-slate-100" />
            ))}
          </div>
        </div>
      </div>

      {/* Second year block */}
      <div className="space-y-4">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 flex-shrink-0" />
          <div className="flex-1 h-px bg-slate-100" />
        </div>
        <div className="ml-10 space-y-3">
          <div className="h-4 w-12 rounded-full bg-slate-100" />
          <div className="grid grid-cols-2 gap-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-24 rounded-[20px] bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
