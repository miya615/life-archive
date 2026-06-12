export default function ProfileLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="w-24 h-24 rounded-3xl bg-slate-100" />
        <div className="space-y-2 text-center">
          <div className="h-6 w-32 rounded-full bg-slate-100 mx-auto" />
          <div className="h-4 w-48 rounded-full bg-slate-100 mx-auto" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 rounded-[20px] bg-slate-100" />
        ))}
      </div>

      {/* Settings list */}
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-[20px] bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
