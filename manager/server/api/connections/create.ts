import { Prisma } from "@prisma/client";
import { createConnection } from "../../data/connections";
import { io } from "socket.io-client";

export default defineEventHandler(async (e) => {
  const body = await readRawBody(e);
  const { name, port, secret } = JSON.parse(body as string);

  const newConnection = await createConnection({
    name,
    port: ~~port,
    secret,
  });

  const ws = io("http://manager:3001" as string);

  ws.emit("createConnection", newConnection.id);

  return newConnection;
});
