import axios, { AxiosInstance } from "axios";
import { Socket, io } from "socket.io-client";
import { ConnectionItem } from "types";

export interface WPPInstance {
  api: AxiosInstance;
  socket: Socket;
}

let instance: WPPInstance | any = null;

export function createInstance({
  https = false,
  host = "localhost",
  port,
  token,
}: ConnectionItem): WPPInstance {
  const apiURL = `http${https ? "s" : ""}://${host}:${port}/api/mySession`;
  const socketURL = `http${https ? "s" : ""}://${host}:${port}`;
  const headers: { Authorization?: string } = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const api = axios.create({ baseURL: apiURL, headers });
  const socket = io(socketURL);
  instance = { api, socket };
  return instance;
}
