import { io } from "socket.io-client";
import { SharePlayApi } from "./API/api";

const socket = io(SharePlayApi, {
  autoConnect: false,
});

export default socket;
