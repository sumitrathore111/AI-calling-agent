import { CalendarDays, PhoneCall, AlertCircle } from "lucide-react";

export default function AppointmentCard({
  name, phone, reason, status, date, time, insurance, callDuration
}: {
  name: string; phone: string; reason: string; status: string;
  date: string; time: string; insurance?: string; callDuration?: number;
}) {
  const chipCls =
    status === "Confirmed" ? "bg-black text-white" :
    status === "Pending" ? "bg-yellow-100 text-yellow-700" :
    status === "Rescheduled" ? "bg-slate-900 text-white" :
    "bg-rose-100 text-rose-700";

  return (
    <div className="card p-5 flex gap-4 items-start">
      <div className="size-10 rounded-2xl bg-blue-100 grid place-items-center text-blue-700">
        <CalendarDays />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold">{name}</div>
          <span className={`text-xs px-2 py-0.5 rounded-md ${chipCls}`}>{status}</span>
        </div>
        <div className="text-slate-500 mt-1">{reason}</div>
        <div className="mt-3 grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> {date} at {time}</div>
          <div className="flex items-center gap-2"><PhoneCall className="w-4 h-4" /> {phone}</div>
          <div className="text-right text-slate-500">{insurance || "-"}</div>
        </div>
        {callDuration ? <div className="text-xs text-slate-500 mt-2">Call: {(callDuration/60).toFixed(0)}:{String(callDuration%60).padStart(2,"0")}</div> : null}
      </div>
      <button className="text-sm font-medium text-slate-800 hover:underline">View Details</button>
    </div>
  );
}
