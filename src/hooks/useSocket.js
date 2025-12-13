import { useState, useEffect } from "react";
import socket from "../socket";
import { SOCKET_EVENTS } from "../constants";
import { generateAvatar } from "../utils";

const useSocket = (roomId, username, status = '') => {
  const [connected, setConnected] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [user, setUser] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  const [kicked, setKicked] = useState(false);
  const [roomEnded, setRoomEnded] = useState(false);

  useEffect(() => {
    const avatar = generateAvatar(username);
    
    function handleConnect() {
      setConnected(true);
      socket.emit(SOCKET_EVENTS.JOIN_ROOM, { 
        roomId, 
        username,
        avatar,
        status 
      });
    }

    function handleDisconnect() {
      setConnected(false);
    }

    function hasJoinedRoom(data) {
      setUser(data);
      setJoinedRoom(true);
    }

    function onJoinRequest({ username, socketId, avatar }) {
      setJoinRequests((prevRequests) => [
        ...prevRequests,
        { username, socketId, avatar },
      ]);
    }

    function onUserKicked() {
      setKicked(true);
      socket.disconnect();
    }

    function onRoomEnded() {
      setRoomEnded(true);
      socket.disconnect();
    }

    function onUserPromotedToAdmin({ isAdmin }) {
      setUser((prevUser) => ({
        ...prevUser,
        isAdmin,
      }));
    }

    function onUserDemotedFromAdmin({ isAdmin }) {
      setUser((prevUser) => ({
        ...prevUser,
        isAdmin,
      }));
    }

    socket.on(SOCKET_EVENTS.CONNECT, handleConnect);
    socket.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
    socket.on(SOCKET_EVENTS.JOINED_ROOM, hasJoinedRoom);
    socket.on(SOCKET_EVENTS.JOIN_REQUEST, onJoinRequest);
    socket.on(SOCKET_EVENTS.USER_KICKED, onUserKicked);
    socket.on(SOCKET_EVENTS.ROOM_ENDED, onRoomEnded);
    socket.on(SOCKET_EVENTS.USER_PROMOTED_TO_ADMIN, onUserPromotedToAdmin);
    socket.on(SOCKET_EVENTS.USER_DEMOTED_FROM_ADMIN, onUserDemotedFromAdmin);

    socket.connect();

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, handleConnect);
      socket.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
      socket.off(SOCKET_EVENTS.JOINED_ROOM, hasJoinedRoom);
      socket.off(SOCKET_EVENTS.JOIN_REQUEST, onJoinRequest);
      socket.off(SOCKET_EVENTS.USER_KICKED, onUserKicked);
      socket.off(SOCKET_EVENTS.ROOM_ENDED, onRoomEnded);
      socket.off(SOCKET_EVENTS.USER_PROMOTED_TO_ADMIN, onUserPromotedToAdmin);
      socket.off(SOCKET_EVENTS.USER_DEMOTED_FROM_ADMIN, onUserDemotedFromAdmin);
      socket.disconnect();
    };
  }, [roomId, username, status]);

  return {
    connected,
    joinedRoom,
    user,
    joinRequests,
    setJoinRequests,
    kicked,
    roomEnded,
  };
};

export default useSocket;
