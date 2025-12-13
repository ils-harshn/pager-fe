import { useState, useEffect } from "react";
import socket from "../socket";
import { SOCKET_EVENTS } from "../constants";

const useSocket = (roomId, username) => {
  const [connected, setConnected] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [user, setUser] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);

  useEffect(() => {
    function handleConnect() {
      setConnected(true);
      socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId, username });
    }

    function handleDisconnect() {
      setConnected(false);
    }

    function hasJoinedRoom(data) {
      setUser(data);
      setJoinedRoom(true);
    }

    function onJoinRequest({ username, socketId }) {
      setJoinRequests((prevRequests) => [
        ...prevRequests,
        { username, socketId },
      ]);
    }

    socket.on(SOCKET_EVENTS.CONNECT, handleConnect);
    socket.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
    socket.on(SOCKET_EVENTS.JOINED_ROOM, hasJoinedRoom);
    socket.on(SOCKET_EVENTS.JOIN_REQUEST, onJoinRequest);

    socket.connect();

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, handleConnect);
      socket.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
      socket.off(SOCKET_EVENTS.JOINED_ROOM, hasJoinedRoom);
      socket.off(SOCKET_EVENTS.JOIN_REQUEST, onJoinRequest);
      socket.disconnect();
    };
  }, [roomId, username]);

  return {
    connected,
    joinedRoom,
    user,
    joinRequests,
    setJoinRequests,
  };
};

export default useSocket;
