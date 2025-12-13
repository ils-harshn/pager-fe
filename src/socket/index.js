import { io } from "socket.io-client";
import config from "../config";

const socket = io(config.uri, {
  autoConnect: false,
});

export default socket;

