// scripts/verify-prisma.ts — Verify Prisma Postgres connection
import "dotenv/config";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  try {
    const cities = await prisma.city.findMany({
      include: { records: { take: 1, orderBy: { timestamp: "desc" } } },
    });

    if (cities.length === 0) {
      console.log("⚠️  Connected but no cities found. Run: npx prisma db seed");
      return;
    }

    console.log("✅ Connected to Prisma Postgres successfully!\n");
    console.log(`   Cities in database: ${cities.length}`);
    cities.forEach(c => {
      const latest = c.records[0];
      console.log(`   • ${c.name} — Latest AQI: ${latest?.aqi ?? "no records"}`);
    });
  } catch (err) {
    console.error("❌ Connection failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
