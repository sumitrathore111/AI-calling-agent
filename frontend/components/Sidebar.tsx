"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PhoneCall, Users, CalendarCheck } from "lucide-react";

const items = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/calls", label: "Call Logs", icon: PhoneCall },
  { href: "/leads", label: "Lead Generation", icon: Users },
  { href: "/appointments", label: "Appointments", icon: CalendarCheck }
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="h-screen w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="px-5 py-4 border-b">
        <div className="text-sm text-slate-500">AI Dashboard</div>
        <div className="font-semibold">Voice Agent Services</div>
      </div>

      <div className="px-5 py-4 flex items-center gap-3">
        <div className="size-10 rounded-full bg-indigo-100 grid place-items-center text-indigo-700 font-bold">D</div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">djjagatraj1111</div>
          <div className="text-xs text-slate-500">djjagatraj1111@gmail...</div>
          <div className="text-[10px] text-slate-400">ID: 13811855</div>
        </div>
        <span className="ml-auto size-2.5 rounded-full bg-green-500" />
      </div>

      <nav className="px-3 mt-2 space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${
                active ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-5 py-4 text-xs text-slate-400">Sign Out</div>
    </aside>
  );
}
