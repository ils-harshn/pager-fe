import { useState, useEffect } from "react";
import socket from "../../socket";
import { SOCKET_EVENTS } from "../../constants";
import { roomService } from "../../services";

const ListConnectedUsers = ({ roomId, loggedUser }) => {
  const [users, setUsers] = useState([]);

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
