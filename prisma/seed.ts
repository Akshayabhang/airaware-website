import "dotenv/config";
import { PrismaClient } from "../generated/prisma";


// Use standard PrismaClient — DATABASE_URL is Prisma Postgres so it connects directly
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding AirAware database...");

  const cities = [
    { name: "Pune",   lat: 18.5204, lng: 73.8567 },
    { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
    { name: "Delhi",  lat: 28.7041, lng: 77.1025 },
  ];

  for (const city of cities) {
    const c = await prisma.city.upsert({
      where:  { name: city.name },
      update: {},
      create: city,
    });

    await prisma.aqiRecord.createMany({
      data: [
        {
          cityId:    c.id,
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          aqi:       Math.floor(Math.random() * 150) + 50,
          pm25:      parseFloat((Math.random() * 80).toFixed(2)),
          pm10:      parseFloat((Math.random() * 120).toFixed(2)),
        },
        {
          cityId:    c.id,
          timestamp: new Date(),
          aqi:       Math.floor(Math.random() * 150) + 50,
          pm25:      parseFloat((Math.random() * 80).toFixed(2)),
          pm10:      parseFloat((Math.random() * 120).toFixed(2)),
        },
      ],
      skipDuplicates: true,
    });

    console.log(`  ✔ Seeded ${city.name}`);
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
