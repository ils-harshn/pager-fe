const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  JOIN_ROOM: "joinRoom",
  JOINED_ROOM: "joinedRoom",
  JOIN_REQUEST: "joinrequest",
  JOIN_REQUEST_CANCELLED: "joinrequestcancelled",
  APPROVE_JOIN: "approveJoin",
  MESSAGE: "message",
  UPDATE_USERS: "updateUsers",
};

export default SOCKET_EVENTS;
