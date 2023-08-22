import { Server } from "socket.io";
import { createConnection } from "../worker";

export default defineNitroPlugin((nuxtApp) => {
  const io = new Server(3001, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.on("createConnection", (id: string) => {
      createConnection(id);
    });
  });
});
