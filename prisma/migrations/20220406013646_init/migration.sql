-- CreateTable
CREATE TABLE "Island" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "terrainId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "workshopId" TEXT,
    "isOfficial" BOOLEAN NOT NULL,

    CONSTRAINT "Island_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "modIds" BIGINT[],
    "queryPort" INTEGER NOT NULL,
    "gamePort" INTEGER NOT NULL,
    "appId" INTEGER NOT NULL,
    "playerCount" INTEGER NOT NULL DEFAULT 0,
    "maxPlayerCount" INTEGER NOT NULL DEFAULT 0,
    "queueCount" INTEGER NOT NULL DEFAULT 0,
    "timeAcceleration" INTEGER[],
    "ipAddress" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "clockTime" TEXT NOT NULL,
    "island" TEXT NOT NULL,
    "isFirstPerson" BOOLEAN NOT NULL,
    "isPassword" BOOLEAN NOT NULL,
    "isBattleEye" BOOLEAN NOT NULL,
    "isVAC" BOOLEAN NOT NULL,
    "isPublicHive" BOOLEAN NOT NULL,
    "isMonetised" BOOLEAN NOT NULL,
    "isOffline" BOOLEAN NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Island_terrainId_key" ON "Island"("terrainId");

-- CreateIndex
CREATE UNIQUE INDEX "Server_ipAddress_queryPort_key" ON "Server"("ipAddress", "queryPort");
