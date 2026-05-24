export default function AdminLoading() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-64 animate-pulse rounded-full bg-white/10" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-3xl bg-white/[0.06]" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-3xl bg-white/[0.06]" />
    </div>
  );
}
