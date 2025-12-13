import { useState, useEffect } from "react";
import socket from "../../socket";
import { SOCKET_EVENTS } from "../../constants";
import { roomService } from "../../services";
import { FaUserTimes } from "react-icons/fa";

const ListConnectedUsers = ({ roomId, loggedUser }) => {
  const [users, setUsers] = useState([]);

  const handleKickUser = (userId) => {
    socket.emit(SOCKET_EVENTS.KICK_USER, { socketId: userId });
  };

  useEffect(() => {
    const handleUpdateUsers = (data) => {
      setUsers(data.users);
    };

    roomService
      .getConnectedUsers(roomId)
      .then((data) => {
        handleUpdateUsers(data);
      })
      .catch((err) => {
        console.error("Failed to fetch connected users:", err);
      })
      .finally(() => {
        socket.on(SOCKET_EVENTS.UPDATE_USERS, handleUpdateUsers);
      });

    return () => {
      socket.off(SOCKET_EVENTS.UPDATE_USERS, handleUpdateUsers);
    };
  }, [roomId]);

  return (
    <>
      <div className="border-[#f23bff] border-b bg-[#992ac1] px-5 py-2">
        <h3 className="text-white font-bold">Room Members</h3>
      </div>
      <div>
        <ul>
          {users
            .filter((user) => user.id !== loggedUser?.id)
            .map((user, index) => (
              <li
                key={index}
                className="border-[#B3B3B3] border-b flex justify-between items-center"
              >
                <div className="px-5 py-2">
                  <p className="text-white">
                    {user.username}
                    {user?.owner ? " (Moderator)" : ""}
                  </p>
                </div>
                {loggedUser?.owner && !user?.owner && (
                  <div className="pr-2">
                    <button
                      onClick={() => handleKickUser(user.id)}
                      className="bg-[#d53703] px-3 py-1 text-white rounded-full text-nowrap text-sm font-bold flex items-center gap-1 hover:bg-[#ff4411]"
                      title="Kick user from room"
                    >
                      <FaUserTimes />
                      <span>Kick</span>
                    </button>
                  </div>
                )}
              </li>
            ))}
          <li className="border-[#B3B3B3] border-b flex justify-between items-center">
            <div className="px-5 py-2">
              <p className="text-white">
                {loggedUser.username} (You)
                {loggedUser?.owner ? " (Moderator)" : ""}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ListConnectedUsers;
