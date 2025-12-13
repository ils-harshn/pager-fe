const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  JOIN_ROOM: "joinRoom",
  JOINED_ROOM: "joinedRoom",
  JOIN_REQUEST: "joinrequest",
  JOIN_REQUEST_CANCELLED: "joinrequestcancelled",
  JOIN_REQUEST_RESOLVED: "joinRequestResolved",
  APPROVE_JOIN: "approveJoin",
  REJECT_JOIN: "rejectJoin",
  KICK_USER: "kickUser",
  USER_KICKED: "userKicked",
  MAKE_ADMIN: "makeAdmin",
  REVOKE_ADMIN: "revokeAdmin",
  USER_PROMOTED_TO_ADMIN: "userPromotedToAdmin",
  USER_DEMOTED_FROM_ADMIN: "userDemotedFromAdmin",
  ROOM_ENDED: "roomEnded",
  MESSAGE: "message",
  UPDATE_USERS: "updateUsers",
  UPDATE_LOGS: "updateLogs",
};

export default SOCKET_EVENTS;
