"use client";
import { useEffect, useState } from "react";
import CallItem from "../../components/CallItem";

export default function CallsPage() {
  const [calls, setCalls] = useState<any[]>([]);

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5000") + "/api/calls")
      .then((res) => res.json())
      .then(setCalls)
      .catch((err) => console.error("Failed to load calls:", err));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Call Logs</h1>
      <p className="text-slate-500">History of all agent calls</p>

      <div className="space-y-4">
        {calls.length === 0 && (
          <p className="text-slate-500">No calls recorded yet.</p>
        )}
        {calls.map((c) => (
          <CallItem
            key={c.id}
            type={c.type}
            phone={c.phone}
            name={c.caller_name}
            result={c.result}
            duration={`${Math.floor(c.duration_seconds / 60)}:${String(
              c.duration_seconds % 60
            ).padStart(2, "0")}`}
            when={new Date(c.created_at).toLocaleString()}
            sentiment={c.sentiment}
            leadScore={c.lead_score}
          />
        ))}
      </div>
    </div>
  );
}
