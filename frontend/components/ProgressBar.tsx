export default function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-4">
      <div className="text-sm mb-1">{label}</div>
      <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-black" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
