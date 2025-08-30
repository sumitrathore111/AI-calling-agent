import { ReactNode } from "react";

export default function StatCard({
  title, value, sub, icon
}: { title: string; value: string | number; sub?: string; icon?: ReactNode; }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between text-slate-500">
        <div className="text-sm">{title}</div>
        <div>{icon}</div>
      </div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
      {sub ? <div className="text-xs text-slate-500 mt-1">{sub}</div> : null}
    </div>
  );
}
