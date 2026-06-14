-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "lat" REAL,
    "lng" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AqiRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cityId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "aqi" INTEGER NOT NULL,
    "pm25" REAL,
    "pm10" REAL,
    "tvoc" REAL,
    "noise" REAL,
    CONSTRAINT "AqiRecord_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "City_name_key" ON "City"("name");

-- CreateIndex
CREATE INDEX "AqiRecord_cityId_timestamp_idx" ON "AqiRecord"("cityId", "timestamp");
