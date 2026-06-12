export default function Loading() {
  return (
    <div className="space-y-4 pt-2 animate-pulse">
      <div className="h-48 rounded-3xl bg-slate-100" />
      <div className="h-5 w-32 rounded-full bg-slate-100" />
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-44 rounded-[20px] bg-slate-100" />
        ))}
      </div>
      <div className="h-32 rounded-[20px] bg-slate-100" />
    </div>
  );
}
