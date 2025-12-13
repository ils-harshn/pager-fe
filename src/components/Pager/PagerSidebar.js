import { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";
import ListConnectedUsers from "./ListConnectedUsers";
import ShowJoinRequests from "./ShowJoinRequests";
import RoomLogs from "./RoomLogs";
import ROUTES from "../../router/ROUTES";

const PagerSidebar = ({ roomId, user, joinRequests, setJoinRequests }) => {
  const [copied, setCopied] = useState(false);

  const handleShareLink = async () => {
    const shareUrl = `${window.location.origin}${ROUTES.GET_JOIN_ROOM(roomId)}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="w-[320px] flex-1 min-w-[320px] max-w-[462px] overflow-y-auto">
      <div className="border-[#00ccff] border-b bg-[#368194] grid grid-cols-2">
        <div className="px-5 py-2">
          <div className="flex items-center justify-between">
            <p className="text-[#f0f0f0da] text-xs font-semibold">
              Room ID (Joined)
            </p>
            <button
              onClick={handleShareLink}
              className="p-1 hover:bg-[#0d7de0] rounded transition-colors"
              title={copied ? "Link copied!" : "Copy join link"}
            >
              {copied ? (
                <FaCheck className="text-green-400 text-sm" />
              ) : (
                <FaCopy className="text-white text-sm" />
              )}
            </button>
          </div>
          <p className="truncate text-white font-bold">{roomId}</p>
        </div>
        <div className="border-l border-[#00ccff] px-5 py-2">
          <div>
            <p className="text-[#f0f0f0da] text-xs font-semibold">
              Your username is
            </p>
          </div>
          <p className="truncate text-white font-bold">{user.username}</p>
        </div>
      </div>
      <ListConnectedUsers roomId={roomId} loggedUser={user} />
      {(user?.owner || user?.isAdmin) && joinRequests?.length ? (
        <ShowJoinRequests
          requests={joinRequests}
          setJoinRequests={setJoinRequests}
        />
      ) : null}
      <RoomLogs />
    </div>
  );
};

export default PagerSidebar;
