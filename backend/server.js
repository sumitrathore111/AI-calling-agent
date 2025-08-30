import express from "express";
import cors from "cors";
import { getDb } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

/** STATS: total calls, leads generated, appointments, conversion */
app.get("/api/stats", async (_req, res) => {
  const db = await getDb();

  const totalCalls = (await db.get(`SELECT COUNT(*) as c FROM calls`)).c;
  const leadsGenerated = (await db.get(`SELECT COUNT(*) as c FROM leads WHERE status IN ('New','Qualified')`)).c;
  const totalAppointments = (await db.get(`SELECT COUNT(*) as c FROM appointments`)).c;

  // naive conversion: qualified leads + confirmed appointments / total calls
  const qualified = (await db.get(`SELECT COUNT(*) as c FROM leads WHERE status='Qualified'`)).c;
  const confirmed = (await db.get(`SELECT COUNT(*) as c FROM appointments WHERE status='Confirmed'`)).c;
  const conversion = totalCalls ? Math.round(((qualified + confirmed) / totalCalls) * 100) : 0;

  res.json({
    totals: {
      calls: totalCalls,
      leads: leadsGenerated,
      appointments: totalAppointments,
      conversionRate: conversion
    },
    perf: {
      leadGeneration: 65,
      appointments: 78,
      overall: 71
    },
    recentCalls: await db.all(`SELECT * FROM calls ORDER BY datetime(created_at) DESC LIMIT 3`)
  });
});

app.get("/api/calls", async (req, res) => {
  const db = await getDb();
  const type = req.query.type; // optional filter
  const base = `SELECT * FROM calls`;
  const rows = type ? await db.all(`${base} WHERE type = ? ORDER BY datetime(created_at) DESC`, [type])
                    : await db.all(`${base} ORDER BY datetime(created_at) DESC`);
  res.json(rows);
});

app.get("/api/leads", async (_req, res) => {
  const db = await getDb();
  res.json(await db.all(`SELECT * FROM leads ORDER BY datetime(created_at) DESC`));
});

app.post("/api/leads", async (req, res) => {
  const { name, phone, email, status = "New", notes = "" } = req.body || {};
  if (!name || !phone) return res.status(400).json({ error: "name and phone required" });
  const db = await getDb();
  const { lastID } = await db.run(
    `INSERT INTO leads (name, phone, email, status, notes) VALUES (?, ?, ?, ?, ?)`,
    [name, phone, email || null, status, notes]
  );
  const lead = await db.get(`SELECT * FROM leads WHERE id = ?`, [lastID]);
  res.status(201).json(lead);
});

app.get("/api/appointments", async (_req, res) => {
  const db = await getDb();
  res.json(await db.all(`SELECT * FROM appointments ORDER BY date(date) DESC, time(time) DESC`));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  // seed once if DB is empty (idempotent light check)
  const db = await getDb();
  const row = await db.get(`SELECT COUNT(*) as c FROM calls`);
  if (row.c === 0) {
    console.log("Database empty. Run `npm run seed` to add demo data.");
  }
  console.log(`Backend listening on http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
  res.send("✅ Voice Agent Backend is running. Use /api/stats, /api/calls, /api/leads, /api/appointments");
});
import multer from "multer";
import csvParser from "csv-parser";
import fs from "fs";

const upload = multer({ dest: "uploads/" });

app.post("/api/upload-csv", upload.single("file"), async (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", (row) => {
      results.push(row); // { name, phone, ... }
    })
    .on("end", async () => {
      const db = await getDb();
      for (const r of results) {
        await db.run(
          `INSERT INTO calls (phone, type, status, created_at) VALUES (?, ?, ?, datetime('now'))`,
          [r.phone, "bulk", "initiated"]
        );
      }
      res.json({ message: "Bulk calls queued", count: results.length });
    });
});
import Millis from "@millisai/web-sdk";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

app.post("/api/call", async (req, res) => {
  const { platform, phone, type } = req.body || {};
  if (!platform || !phone) {
    return res.status(400).json({ error: "platform and phone required" });
  }

  const db = await getDb();
  const { lastID } = await db.run(
    `INSERT INTO calls (phone, type, status, created_at, platform) VALUES (?, ?, ?, datetime('now'), ?)`,
    [phone, type || "manual", "initiated", platform]
  );

  try {
    if (platform === "millis") {
      // Millis outbound call
      const msClient = Millis.createClient({
        publicKey: process.env.MILLIS_PUBLIC_KEY,
        endPoint: "wss://api-west.millis.ai:8080", // adjust region if needed
      });

      await msClient.start({
        agent: {
          agent_id: process.env.MILLIS_AGENT_ID,
        },
        metadata: { phone, type },
      });

      console.log(`📞 Millis call started to ${phone}`);
    }

    if (platform === "vapi") {
      // Vapi REST API outbound call
      const response = await axios.post(
        "https://api.vapi.ai/call",
        {
          agentId: process.env.VAPI_AGENT_ID,
          phoneNumber: phone,
          metadata: { type },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`📞 Vapi call started to ${phone}`, response.data);
    }

    res.json({
      success: true,
      id: lastID,
      platform,
      phone,
      message: `Call triggered via ${platform}`,
    });
  } catch (err) {
    console.error("Call trigger failed:", err.response?.data || err.message);
    res.status(500).json({
      error: `Failed to trigger call via ${platform}`,
      details: err.response?.data || err.message,
    });
  }
});
