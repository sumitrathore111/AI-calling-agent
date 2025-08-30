import { getDb } from "./db.js";

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

(async () => {
  const db = await getDb();

  await db.exec("DELETE FROM calls;");
  await db.exec("DELETE FROM leads;");
  await db.exec("DELETE FROM appointments;");

  // Calls (like your screenshot)
  const calls = [
    {
      type: "Lead Generation", duration_seconds: 272, sentiment: "Positive",
      phone: "+1 (555) 123-4567", caller_name: "John Smith", result: "Qualified Lead",
      lead_score: 85, created_at: daysAgo(0.1)
    },
    {
      type: "Appointment", duration_seconds: 195, sentiment: "Neutral",
      phone: "+1 (555) 987-6543", caller_name: "Sarah Johnson", result: "Appointment Booked",
      lead_score: null, created_at: daysAgo(0.2)
    },
    {
      type: "Lead Generation", duration_seconds: 168, sentiment: "Negative",
      phone: "+1 (555) 456-7890", caller_name: "Mike Wilson", result: "Not Qualified",
      lead_score: 25, created_at: daysAgo(0.3)
    }
  ];

  for (const c of calls) {
    await db.run(
      `INSERT INTO calls (type, duration_seconds, sentiment, phone, caller_name, result, lead_score, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [c.type, c.duration_seconds, c.sentiment, c.phone, c.caller_name, c.result, c.lead_score, c.created_at]
    );
  }

  // Leads
  const leads = [
    { name: "Priya Verma", phone: "+91 90000 11111", email: "priya@example.com", status: "New", notes: "Asked pricing" },
    { name: "Rohan Mehta", phone: "+91 98888 22222", email: "rohan@example.com", status: "Qualified", notes: "Ready for demo" },
    { name: "Aditi Kumar", phone: "+91 97777 33333", email: "aditi@example.com", status: "Not Interested", notes: "Busy this month" }
  ];
  for (const l of leads) {
    await db.run(
      `INSERT INTO leads (name, phone, email, status, notes) VALUES (?, ?, ?, ?, ?)`,
      [l.name, l.phone, l.email, l.status, l.notes]
    );
  }

  // Appointments
  const appts = [
    { name: "Sarah Johnson", phone: "+1 (555) 987-6543", reason: "Routine checkup", status: "Confirmed", date: "2025-01-22", time: "14:00", insurance: "Blue Cross", call_duration_seconds: 195 },
    { name: "Emma Davis", phone: "+1 (555) 321-0987", reason: "Blood pressure follow-up", status: "Rescheduled", date: "2025-01-25", time: "10:00", insurance: "Aetna", call_duration_seconds: 312 },
    { name: "Robert Chen", phone: "+1 (555) 654-3210", reason: "Back pain consultation", status: "Pending", date: "2025-01-20", time: "09:00", insurance: "United Healthcare", call_duration_seconds: 210 }
  ];
  for (const a of appts) {
    await db.run(
      `INSERT INTO appointments (name, phone, reason, status, date, time, insurance, call_duration_seconds)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [a.name, a.phone, a.reason, a.status, a.date, a.time, a.insurance, a.call_duration_seconds]
    );
  }

  console.log("Seeded ✅");
  process.exit(0);
})();
