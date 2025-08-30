"use client";
import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import ProgressBar from "../components/ProgressBar";
import CallItem from "../components/CallItem";
import { PhoneCall, Users, CalendarCheck, TrendingUp } from "lucide-react";

type Stats = {
  totals: {
    calls: number;
    leads: number;
    appointments: number;
    conversionRate: number;
  };
  perf: {
    leadGeneration: number;
    appointments: number;
    overall: number;
  };
  recentCalls: any[];
};

export default function Overview() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5000") + "/api/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch((err) => console.error("Failed to load stats:", err));
  }, []);

  return (
    <div className="space-y-6">
      <div style={{ justifyContent: 'space-between', flexDirection: 'row' , flex:1 }} >

        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">
            Welcome back! Here&apos;s your AI service summary.
          </p>
        </div>
        <div className="flex justify-end" >
          <div style={{backgroundColor:'lightblue', padding:10, borderRadius:5, cursor:'pointer', fontWeight:'bold'}} >

          Make Call
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          title="Total Calls"
          value={stats?.totals.calls ?? "..."}
          sub="+12% from last week"
          icon={<PhoneCall />}
        />
        <StatCard
          title="Leads Generated"
          value={stats?.totals.leads ?? "..."}
          sub="+8% from last week"
          icon={<Users />}
        />
        <StatCard
          title="Appointments"
          value={stats?.totals.appointments ?? "..."}
          sub="+15% from last week"
          icon={<CalendarCheck />}
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats?.totals.conversionRate ?? "..."}%`}
          sub="+3% from last week"
          icon={<TrendingUp />}
        />
      </div>

      {/* Conversion Performance + Recent Calls */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conversion Performance */}
        <div className="card p-5 lg:col-span-2">
          <div className="text-lg font-semibold">Conversion Performance</div>
          <div className="text-slate-500 text-sm mb-4">
            Call success rates by service type
          </div>
          <ProgressBar label="Lead Generation" value={stats?.perf.leadGeneration ?? 0} />
          <ProgressBar label="Appointments" value={stats?.perf.appointments ?? 0} />
          <ProgressBar label="Overall" value={stats?.perf.overall ?? 0} />
        </div>

        {/* Recent Calls */}
        <div className="card p-5">
          <div className="text-lg font-semibold">Recent Calls</div>
          <div className="text-slate-500 text-sm mb-4">
            Latest voice agent interactions
          </div>
          <div className="space-y-4">
            {(stats?.recentCalls ?? []).map((c) => (
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
      </div>
    </div>
  );
}
