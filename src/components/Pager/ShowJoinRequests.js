import socket from "../../socket";
import { SOCKET_EVENTS } from "../../constants";
import { Button, UserInfo, SectionHeader } from "../common";
import { useSocketEvent } from "../../hooks";

const ShowJoinRequests = ({ requests, setJoinRequests }) => {
  const approveJoin = (socketId) => {
    socket.emit(SOCKET_EVENTS.APPROVE_JOIN, { socketId });
    setJoinRequests((prevRequests) =>
      prevRequests.filter((request) => request.socketId !== socketId)
    );
  };

  const rejectJoin = (socketId) => {
    socket.emit(SOCKET_EVENTS.REJECT_JOIN, { socketId });
    setJoinRequests((prevRequests) =>
      prevRequests.filter((request) => request.socketId !== socketId)
    );
  };

  const handleJoinRequestResolved = ({ socketId }) => {
    setJoinRequests((prevRequests) =>
      prevRequests.filter((request) => request.socketId !== socketId)
    );
  };

  useSocketEvent(socket, [
    { event: SOCKET_EVENTS.JOIN_REQUEST_CANCELLED, handler: handleJoinRequestResolved },
    { event: SOCKET_EVENTS.JOIN_REQUEST_RESOLVED, handler: handleJoinRequestResolved },
  ]);

  return (
    <>
      <SectionHeader 
        title="Join Requests" 
        bgColor="#b7c12a" 
        borderColor="#FFD43B" 
      />
      <div>
        <ul>
          {requests.map((request, index) => (
            <li
              key={index}
              className="border-[#B3B3B3] border-b flex justify-between items-center"
            >
              <div className="px-5 py-2">
                <UserInfo 
                  user={{ ...request, username: request.username }} 
                  avatarSize="small" 
                  showStatus={false}
                />
              </div>
              <div className="flex items-center gap-2 pr-1">
                <Button
                  onClick={() => approveJoin(request.socketId)}
                  variant="success"
                  size="small"
                  type="submit"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => rejectJoin(request.socketId)}
                  variant="danger"
                  size="small"
                  type="submit"
                >
                  Reject
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ShowJoinRequests;
