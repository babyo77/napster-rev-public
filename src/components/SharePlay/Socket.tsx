import { SharePlayApi } from "@/API/api";
import { io } from "socket.io-client";

export const socket = io(SharePlayApi, {
  autoConnect: false,
});
