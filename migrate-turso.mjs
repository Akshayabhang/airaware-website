/**
 * migrate-turso.mjs
 * 
 * One-time script to create the AirWave database tables in Turso.
 * Run this after setting up your Turso database.
 * 
 * Usage:
 *   TURSO_DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="eyJ..." node migrate-turso.mjs
 */

import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error('❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN env vars');
  process.exit(1);
}

const db = createClient({ url, authToken });

console.log('🔌 Connected to Turso at:', url);

const migrations = [
  `CREATE TABLE IF NOT EXISTS "City" (
    "id"        TEXT NOT NULL PRIMARY KEY,
    "name"      TEXT NOT NULL UNIQUE,
    "lat"       REAL,
    "lng"       REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS "AqiRecord" (
    "id"        TEXT NOT NULL PRIMARY KEY,
    "cityId"    TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "aqi"       INTEGER NOT NULL,
    "pm25"      REAL,
    "pm10"      REAL,
    "tvoc"      REAL,
    "noise"     REAL,
    CONSTRAINT "AqiRecord_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,

  `CREATE INDEX IF NOT EXISTS "AqiRecord_cityId_timestamp_idx" ON "AqiRecord"("cityId", "timestamp")`,
];

for (const sql of migrations) {
  const tableName = sql.match(/TABLE\s+(?:IF NOT EXISTS\s+)?"?(\w+)"?/i)?.[1] || 
                    sql.match(/INDEX\s+(?:IF NOT EXISTS\s+)?"?(\w+)"?/i)?.[1];
  try {
    await db.execute(sql);
    console.log(`✅ Created: ${tableName}`);
  } catch (err) {
    console.error(`❌ Failed on ${tableName}:`, err.message);
    process.exit(1);
  }
}

console.log('\n🎉 Turso database schema applied successfully!');
console.log('   Tables: City, AqiRecord');
console.log('   Database is ready for AirWave deployment.');
