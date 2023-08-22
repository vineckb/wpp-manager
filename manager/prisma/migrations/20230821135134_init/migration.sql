-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "https" BOOLEAN NOT NULL DEFAULT false,
    "host" TEXT NOT NULL DEFAULT 'localhost',
    "port" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "name" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "token" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Connection_key_key" ON "Connection"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_port_key" ON "Connection"("port");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_name_key" ON "Connection"("name");
