import { useEffect } from "react";
import socket from "../../socket";
import { SOCKET_EVENTS } from "../../constants";

const ShowJoinRequests = ({ requests, setJoinRequests }) => {
  const approveJoin = (socketId) => {
    socket.emit(SOCKET_EVENTS.APPROVE_JOIN, { socketId });
    setJoinRequests((prevRequests) =>
      prevRequests.filter((request) => request.socketId !== socketId)
    );
  };

  const rejectJoin = (socketId) => {
    setJoinRequests((prevRequests) =>
      prevRequests.filter((request) => request.socketId !== socketId)
    );
  };

  useEffect(() => {
    const handleJoinRequestCancelled = ({ socketId }) => {
      setJoinRequests((prevRequests) =>
        prevRequests.filter((request) => request.socketId !== socketId)
      );
    };
    socket.on(SOCKET_EVENTS.JOIN_REQUEST_CANCELLED, handleJoinRequestCancelled);
    return () => {
      socket.off(SOCKET_EVENTS.JOIN_REQUEST_CANCELLED, handleJoinRequestCancelled);
    };
  }, []);

  return (
    <>
      <div className="border-[#FFD43B] border-b bg-[#b7c12a] px-5 py-2">
        <h3 className="text-white font-bold">Join Requests</h3>
      </div>
      <div>
        <ul>
          {requests.map((request, index) => (
            <li
              key={index}
              className="border-[#B3B3B3] border-b flex justify-between items-center"
            >
              <div className="px-5 py-2 flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: request.avatar?.color }}
                >
                  {request.avatar?.emoji}
                </div>
                <p className="text-white font-semibold">{request.username}</p>
              </div>
              <div className="flex items-center gap-2 pr-1">
                <button
                  onClick={() => approveJoin(request.socketId)}
                  className="bg-[#03d506] px-3 py-1 text-white rounded-full text-nowrap text-sm font-bold"
                  type="submit"
                >
                  Approve
                </button>
                <button
                  onClick={() => rejectJoin(request.socketId)}
                  className="bg-[#d53703] px-3 py-1 text-white rounded-full text-nowrap text-sm font-bold"
                  type="submit"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ShowJoinRequests;
