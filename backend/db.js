import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "data.db");
const SCHEMA = path.join(__dirname, "schema.sql");

export async function getDb() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  // Initialize schema only if database is empty
  const isNewDb = !fs.existsSync(DB_PATH) || (await db.get("SELECT count(*) as c FROM sqlite_master WHERE type='table'"))?.c === 0;

  if (isNewDb) {
    const schema = fs.readFileSync(SCHEMA, "utf8");
    await db.exec(schema);
    console.log("✅ Database schema initialized");
  }

  return db;
}
