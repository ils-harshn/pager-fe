import ListConnectedUsers from "./ListConnectedUsers";
import ShowJoinRequests from "./ShowJoinRequests";
import RoomLogs from "./RoomLogs";

const PagerSidebar = ({ roomId, user, joinRequests, setJoinRequests }) => {
  return (
    <div className="w-[320px] flex-1 min-w-[320px] max-w-[462px] overflow-y-auto">
      <div className="border-[#00ccff] border-b bg-[#368194] grid grid-cols-2">
        <div className="px-5 py-2">
          <div>
            <p className="text-[#f0f0f0da] text-xs font-semibold">
              Room ID (Joined)
            </p>
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
      {user?.owner && joinRequests?.length ? (
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
