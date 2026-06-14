-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AqiRecord" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "aqi" INTEGER NOT NULL,
    "pm25" DOUBLE PRECISION,
    "pm10" DOUBLE PRECISION,
    "tvoc" DOUBLE PRECISION,
    "noise" DOUBLE PRECISION,

    CONSTRAINT "AqiRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "City_name_key" ON "City"("name");

-- CreateIndex
CREATE INDEX "AqiRecord_cityId_timestamp_idx" ON "AqiRecord"("cityId", "timestamp");

-- AddForeignKey
ALTER TABLE "AqiRecord" ADD CONSTRAINT "AqiRecord_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
