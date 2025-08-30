import { PhoneCall, BadgeCheck, XCircle } from "lucide-react";

export default function CallItem({
  type, phone, name, result, duration, when, sentiment, leadScore
}: {
  type: string; phone: string; name?: string; result: string;
  duration: string; when: string; sentiment: string; leadScore?: number|null;
}) {
  const chip =
    result.includes("Qualified") ? { text: "Positive", cls: "bg-green-100 text-green-700" } :
    result.includes("Not") ? { text: "Negative", cls: "bg-rose-100 text-rose-700" } :
    { text: "Neutral", cls: "bg-slate-100 text-slate-700" };

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className="size-10 rounded-2xl bg-indigo-100 grid place-items-center text-indigo-700">
        <PhoneCall />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-700">{type}</span>
          <span className={`px-2 py-0.5 rounded-lg ${chip.cls}`}>{chip.text}</span>
          <span className="text-slate-400">• {duration}</span>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-2 text-sm">
          <div>
            <div className="text-slate-500">Phone Number</div>
            <div className="font-medium">{phone}</div>
          </div>
          <div>
            <div className="text-slate-500">Caller Name</div>
            <div className="font-medium">{name || "-"}</div>
          </div>
          <div>
            <div className="text-slate-500">Result</div>
            <div className="font-medium">{result}</div>
          </div>
          <div className="text-right text-xs text-slate-500">{when}</div>
        </div>
        {typeof leadScore === "number" ? (
          <div className="mt-3 text-xs inline-flex items-center gap-2">
            Lead Score:
            <span className={`px-2 py-0.5 rounded-md text-white ${leadScore >= 70 ? "bg-green-600" : leadScore <= 30 ? "bg-rose-600" : "bg-slate-700"}`}>
              {leadScore}/100
            </span>
          </div>
        ) : null}
      </div>
      <div className="text-slate-400">
        {result.includes("Qualified") ? <BadgeCheck /> : <XCircle />}
      </div>
    </div>
  );
}
