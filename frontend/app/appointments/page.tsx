"use client";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaPhone, FaCheckCircle, FaExclamationCircle, FaTimesCircle } from "react-icons/fa";

type Appointment = {
  id: string;
  client_name: string;
  phone: string;
  reason: string;
  status: "Confirmed" | "Pending" | "Rescheduled" | "Cancelled";
  date: string;
  time: string;
  insurance: string;
  duration_seconds: number;
  priority?: "High Priority";
};

const statusColors = {
  Confirmed: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Rescheduled: "bg-blue-100 text-blue-800",
  Cancelled: "bg-red-100 text-red-800",
};

async function triggerCall(
  platform: "vapi" | "millis",
  phone: string,
  type: "appointment"
) {
  try {
    const res = await fetch("http://localhost:5000/api/call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, phone, type }),
    });
    const data = await res.json();
    alert(`✅ Call triggered with ${platform}: ${JSON.stringify(data)}`);
  } catch (err) {
    console.error(err);
    alert("❌ Failed to trigger call");
  }
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<"All" | "Confirmed" | "Pending" | "Rescheduled">("All");

  useEffect(() => {
    fetch(
      (process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5000") +
        "/api/appointments"
    )
      .then((res) => res.json())
      .then(setAppointments)
      .catch((err) => console.error("Failed to load appointments:", err));
  }, []);

  // Filtering appointments based on status filter
  const filteredAppointments = appointments.filter(
    (appt) => filter === "All" || appt.status === filter
  );

  // Sample summary values from appointments (you can adjust how these are calculated or fetched)
  const total = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === "Confirmed").length;
  const pendingCount = appointments.filter((a) => a.status === "Pending").length;
  const rescheduledCount = appointments.filter((a) => a.status === "Rescheduled").length;
  const cancellationRate = total === 0 ? 0 : ((appointments.filter(a => a.status === "Cancelled").length / total) * 100).toFixed(0);

  // Helper to format seconds to mm:ss
  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${mins}:${seconds.toString().padStart(2, "0")}`;
  };

  // Simple calendar navigation and state
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    // Init to current month/year
    return { month: now.getMonth(), year: now.getFullYear() };
  });

  const daysInMonth = new Date(calendarMonth.year, calendarMonth.month + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarMonth.year, calendarMonth.month, 1).getDay();

  // Move calendar month
  function prevMonth() {
    if (calendarMonth.month === 0) {
      setCalendarMonth({ year: calendarMonth.year - 1, month: 11 });
    } else {
      setCalendarMonth({ ...calendarMonth, month: calendarMonth.month - 1 });
    }
  }
  function nextMonth() {
    if (calendarMonth.month === 11) {
      setCalendarMonth({ year: calendarMonth.year + 1, month: 0 });
    } else {
      setCalendarMonth({ ...calendarMonth, month: calendarMonth.month + 1 });
    }
  }

  // Date selected highlight (default today)
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return now.toDateString();
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Appointment Management</h1>
      <p className="text-slate-600 text-sm mb-4">Manage patient appointments scheduled by your AI voice agent</p>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8">
        <SummaryCard title="Total Appointments" icon={<FaCalendarAlt size={20} />} value={total} />
        <SummaryCard title="Confirmed" icon={<FaCheckCircle size={20} />} value={confirmedCount} iconColor="text-green-600" />
        <SummaryCard title="Pending" icon={<FaExclamationCircle size={20} />} value={pendingCount} iconColor="text-yellow-600" />
        <SummaryCard title="Rescheduled" icon={<FaTimesCircle size={20} />} value={rescheduledCount} iconColor="text-blue-600" />
        <SummaryCard title="Cancellation Rate" icon={<FaTimesCircle size={20} />} value={`${cancellationRate}%`} iconColor="text-red-600" />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Calendar */}
        <section className="w-full md:w-72 bg-white rounded-xl shadow-md p-6 select-none">
          <h2 className="font-semibold mb-4">Appointment Calendar</h2>
          <Calendar
            month={calendarMonth.month}
            year={calendarMonth.year}
            daysInMonth={daysInMonth}
            firstDayOfWeek={firstDayOfWeek}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            prevMonth={prevMonth}
            nextMonth={nextMonth}
          />
        </section>

        {/* Appointment List & Filters */}
        <section className="flex-1">
          <div className="flex gap-3 mb-4">
            {["All", "Confirmed", "Pending", "Rescheduled"].map((f) => (
              <button
                key={f}
                className={`px-4 py-1 rounded-full text-sm font-semibold ${
                  filter === f ? "bg-black text-white" : "border border-gray-300"
                }`}
                onClick={() => setFilter(f as any)}
              >
                {f}
              </button>
            ))}
          </div>

          {filteredAppointments.length === 0 && (
            <p className="text-slate-500">No appointments found for selected filter.</p>
          )}

          <div className="space-y-4">
            {filteredAppointments.map((appt) => {
              const isSelectedDate = new Date(appt.date).toDateString() === selectedDate;
              return (
                <div
                  key={appt.id}
                  className={`flex items-center justify-between p-4 rounded-xl shadow-sm bg-white ${
                    isSelectedDate ? "border-2 border-black" : "border border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Stethoscope icon */}
                    <div className={`flex items-center justify-center rounded-full w-12 h-12 ${
                      appt.status === "Confirmed" ? "bg-blue-200 text-blue-700" :
                      appt.status === "Pending" ? "bg-red-200 text-red-700" :
                      appt.status === "Rescheduled" ? "bg-red-200 text-red-700" : "bg-gray-200 text-gray-600"
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M9 17v-6a2 2 0 10-4 0v3a2 2 0 11-4 0v-3a2 2 0 114 0v6m12-2a4 4 0 01-8 0v-5a3.5 3.5 0 017 0v5z" />
                      </svg>
                    </div>

                    <div>
                      <div className="font-semibold text-lg flex items-center gap-2">
                        {appt.client_name}
                        <StatusBadge text={appt.status} className={statusColors[appt.status]} />
                        {appt.priority && (
                          <StatusBadge text={appt.priority} className="bg-red-600 text-white" />
                        )}
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600 mt-0.5">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt />{" "}
                          {new Date(appt.date).toLocaleDateString()} at {new Date(appt.time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </div>
                        <div><b>{appt.reason}</b></div>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-500 mt-0.5">
                        <div className="flex items-center gap-1"><FaPhone /> {appt.phone}</div>
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                          Call: {formatDuration(appt.duration_seconds)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-sm text-gray-500">
                    <div>{appt.insurance}</div>
                    <button className="font-semibold text-black hover:underline mt-2">View Details</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  icon,
  value,
  iconColor = "text-black",
}: {
  title: string;
  icon: React.ReactNode;
  value: number | string;
  iconColor?: string;
}) {
  return (
    <div className="p-4 bg-white rounded-xl shadow text-center">
      <div className={`mb-2 flex justify-center ${iconColor}`}>{icon}</div>
      <div className="text-sm font-medium text-gray-600">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function StatusBadge({ text, className }: { text: string; className: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold leading-none ${className}`}
    >
      {text}
    </span>
  );
}

function Calendar({
  month,
  year,
  daysInMonth,
  firstDayOfWeek,
  selectedDate,
  setSelectedDate,
  prevMonth,
  nextMonth,
}: {
  month: number;
  year: number;
  daysInMonth: number;
  firstDayOfWeek: number;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  prevMonth: () => void;
  nextMonth: () => void;
}) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Create blanks for days before first day
  const blanks = Array(firstDayOfWeek).fill(null);

  const dates = [...blanks, ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-200">&lt;</button>
        <div className="font-semibold">{monthNames[month]} {year}</div>
        <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-200">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dates.map((day, idx) => {
          if (day === null) return <div key={"blank-" + idx} />;

          const dateObj = new Date(year, month, day);
          const isToday = dateObj.toDateString() === new Date().toDateString();
          const isSelected = dateObj.toDateString() === selectedDate;
          return (
            <button
              key={"day-" + day}
              onClick={() => setSelectedDate(dateObj.toDateString())}
              className={`py-1 rounded ${
                isSelected ? "bg-black text-white" : isToday ? "border border-gray-500" : ""
              }`}
              aria-label={`Select day ${day}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </>
  );
}