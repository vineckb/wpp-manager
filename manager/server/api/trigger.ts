import { io } from "socket.io-client";

export default defineEventHandler(async (e) => {
  const id = "6d8de25f-0f87-486e-a123-b5f6cb9aecce";

  const ws = io(process.env.WS_URL as string);

  ws.emit("createConnection", id);

  return "ok";
});
