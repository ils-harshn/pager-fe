import { useState, useEffect } from "react";
import socket from "../../socket";
import { SOCKET_EVENTS } from "../../constants";
import { roomService } from "../../services";
import { FaUserTimes, FaUserShield } from "react-icons/fa";
import { Button, UserInfo, SectionHeader } from "../common";

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
      <SectionHeader 
        title="Room Members" 
        bgColor="#992ac1" 
        borderColor="#f23bff" 
      />
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
                <div className="px-5 py-2">
                  <UserInfo user={user} />
                </div>
                {(loggedUser?.owner || loggedUser?.isAdmin) && !user?.owner && (
                  <div className="pr-2 flex gap-1">
                    {loggedUser?.owner && !user?.isAdmin && (
                      <Button
                        onClick={() => handleMakeAdmin(user.id)}
                        variant="info"
                        size="small"
                        icon={<FaUserShield />}
                        title="Make user admin"
                      >
                        <span>Make Admin</span>
                      </Button>
                    )}
                    {canRevokeAdmin && user?.isAdmin && (
                      <Button
                        onClick={() => handleRevokeAdmin(user.id)}
                        variant="warning"
                        size="small"
                        icon={<FaUserShield />}
                        title="Revoke admin rights"
                      >
                        <span>Revoke Admin</span>
                      </Button>
                    )}
                    {!user?.isAdmin && (
                      <Button
                        onClick={() => handleKickUser(user.id)}
                        variant="danger"
                        size="small"
                        icon={<FaUserTimes />}
                        className="hover:bg-[#ff4411]"
                        title="Kick user from room"
                      >
                        <span>Kick</span>
                      </Button>
                    )}
                  </div>
                )}
              </li>
              );
            })}
          <li className="border-[#B3B3B3] border-b flex justify-between items-center">
            <div className="px-5 py-2">
              <UserInfo user={loggedUser} showYou={true} />
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ListConnectedUsers;
