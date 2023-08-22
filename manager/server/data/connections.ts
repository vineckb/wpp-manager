import { Prisma } from "@prisma/client";
import prisma from "./prisma";

export async function getConnections() {
  const connections = await prisma.connection.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
  return connections;
}

export async function getConnectionById(id: string) {
  const connection = await prisma.connection.findUnique({
    where: { id },
  });
  return connection;
}

export async function getConnection(key: string) {
  const connection = await prisma.connection.findUnique({
    where: {
      key: String(key),
    },
  });
  return connection;
}

export async function createConnection(data: Prisma.ConnectionCreateInput) {
  let result = null;
  result = await prisma.connection.create({
    data,
  });
  return result;
}

export function updateConnection(
  id: string,
  data: Prisma.ConnectionUpdateInput
) {
  return prisma.connection.update({
    where: { id },
    data,
  });
}
