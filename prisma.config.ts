// prisma.config.ts — Prisma configuration for AirAware
import path from "node:path";
import type { PrismaConfig } from "prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Load env manually (Next.js handles this at runtime, this is for CLI tools)
import "dotenv/config";

export default {
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  adapter: () => {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
    return new PrismaPg(pool);
  },
} satisfies PrismaConfig;
