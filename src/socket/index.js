import config from "../config";

const { io } = require("socket.io-client");

const socket = io(config.uri, {
  autoConnect: false,
});

export default socket;
