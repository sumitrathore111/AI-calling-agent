PRAGMA foreign_keys = ON;

-- =========================
-- Calls Table
-- =========================
CREATE TABLE IF NOT EXISTS calls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,                 -- "Lead Generation" | "Appointment" | etc
  phone TEXT NOT NULL,
  caller_name TEXT,
  platform TEXT,                      -- e.g., "mobile", "web"
  context TEXT,                       -- optional, e.g., "campaign X"
  status TEXT,                        -- "pending", "success", "failed"
  result TEXT,                        -- "Qualified Lead" | "Appointment Booked" | "Not Qualified"
  sentiment TEXT,                     -- "Positive" | "Neutral" | "Negative"
  duration_seconds INTEGER,           -- call duration
  lead_score INTEGER,                 -- 0..100
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- Leads Table
-- =========================
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  call_id INTEGER,                    -- link to calls
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL,               -- "New" | "Qualified" | "Not Interested"
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(call_id) REFERENCES calls(id) ON DELETE CASCADE
);

-- =========================
-- Appointments Table
-- =========================
CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  call_id INTEGER,                    -- link to calls
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL,               -- "Confirmed" | "Pending" | "Rescheduled" | "Cancelled"
  date TEXT NOT NULL,                 -- ISO date "2025-08-28"
  time TEXT NOT NULL,                 -- "14:00"
  insurance TEXT,
  call_duration_seconds INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(call_id) REFERENCES calls(id) ON DELETE CASCADE
);
