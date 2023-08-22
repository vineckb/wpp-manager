import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:topsecret@postgres:5432/wppconnections",
    },
  },
});

export default prisma;
