import { useState, useEffect } from "react";
import socket from "../../socket";
import { SOCKET_EVENTS } from "../../constants";
import { roomService } from "../../services";
import { FaUserTimes, FaUserShield } from "react-icons/fa";

const ListConnectedUsers = ({ roomId, loggedUser }) => {
  const [users, setUsers] = useState([]);

  const handleKickUser = (userId) => {
    socket.emit(SOCKET_EVENTS.KICK_USER, { socketId: userId });
  };

  const handleMakeAdmin = (userId) => {
    socket.emit(SOCKET_EVENTS.MAKE_ADMIN, { socketId: userId });
  };

  const handleRevokeAdmin = (userId) => {
    socket.emit(SOCKET_EVENTS.REVOKE_ADMIN, { socketId: userId });
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
            .map((user, index) => {
              const hasOwner = users.some(u => u.owner);
              const canRevokeAdmin = loggedUser?.owner || (!hasOwner && loggedUser?.isAdmin);
              
              return (
              <li
                key={index}
                className="border-[#B3B3B3] border-b flex justify-between items-center"
              >
                <div className="px-5 py-2 flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: user.avatar?.color }}
                  >
                    {user.avatar?.emoji}
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      {user.username}
                      {user?.owner ? " (Moderator)" : ""}
                      {user?.isAdmin ? " (Admin)" : ""}
                    </p>
                    {user.status && (
                      <p className="text-gray-300 text-xs italic">{user.status}</p>
                    )}
                  </div>
                </div>
                {(loggedUser?.owner || loggedUser?.isAdmin) && !user?.owner && (
                  <div className="pr-2 flex gap-1">
                    {loggedUser?.owner && !user?.isAdmin && (
                      <button
                        onClick={() => handleMakeAdmin(user.id)}
                        className="bg-[#2563eb] px-3 py-1 text-white rounded-full text-nowrap text-sm font-bold flex items-center gap-1 hover:bg-[#3b82f6]"
                        title="Make user admin"
                      >
                        <FaUserShield />
                        <span>Make Admin</span>
                      </button>
                    )}
                    {canRevokeAdmin && user?.isAdmin && (
                      <button
                        onClick={() => handleRevokeAdmin(user.id)}
                        className="bg-[#f59e0b] px-3 py-1 text-white rounded-full text-nowrap text-sm font-bold flex items-center gap-1 hover:bg-[#fbbf24]"
                        title="Revoke admin rights"
                      >
                        <FaUserShield />
                        <span>Revoke Admin</span>
                      </button>
                    )}
                    {!user?.isAdmin && (
                      <button
                        onClick={() => handleKickUser(user.id)}
                        className="bg-[#d53703] px-3 py-1 text-white rounded-full text-nowrap text-sm font-bold flex items-center gap-1 hover:bg-[#ff4411]"
                        title="Kick user from room"
                      >
                        <FaUserTimes />
                        <span>Kick</span>
                      </button>
                    )}
                  </div>
                )}
              </li>
              );
            })}
          <li className="border-[#B3B3B3] border-b flex justify-between items-center">
            <div className="px-5 py-2 flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ backgroundColor: loggedUser.avatar?.color }}
              >
                {loggedUser.avatar?.emoji}
              </div>
              <div>
                <p className="text-white font-semibold">
                  {loggedUser.username} (You)
                  {loggedUser?.owner ? " (Moderator)" : ""}
                  {loggedUser?.isAdmin ? " (Admin)" : ""}
                </p>
                {loggedUser.status && (
                  <p className="text-gray-300 text-xs italic">{loggedUser.status}</p>
                )}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ListConnectedUsers;
