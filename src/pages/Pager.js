import { useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import socket from "../socket";
import MessageInput from "../components/MessageInput";
import Messages from "../components/Messages";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  PagerHeader,
  PagerSidebar,
  LoadingState,
  DisconnectedState,
  WaitingForApproval,
  KickedState,
  RoomEndedState,
} from "../components/Pager";
import { useSocket } from "../hooks";

const Pager = () => {
  const { id, username } = useParams();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "";
  const messagesContainerRef = useRef(null);
  const [scrollButton, setScrollButton] = useState({ show: false, count: 0 });
  const {
    connected,
    joinedRoom,
    user,
    joinRequests,
    setJoinRequests,
    kicked,
    roomEnded,
  } = useSocket(id, username, status);

  const handleScrollToBottom = () => {
    if (messagesContainerRef.current?.scrollToBottomHandler) {
      messagesContainerRef.current.scrollToBottomHandler();
    }
  };

  if (roomEnded) {
    return <RoomEndedState />;
  }

  if (kicked) {
    return <KickedState />;
  }

  if (!connected) {
    return <LoadingState id={id} username={username} />;
  }

  if (socket.disconnected && connected) {
    return <DisconnectedState />;
  }

  if (!joinedRoom) {
    return <WaitingForApproval id={id} />;
  }

  return (
    <div className="mx-auto max-w-[1440px] h-[100dvh] border-l border-r border-[#B3B3B3] flex flex-col">
      <PagerHeader />
      <div className="flex-grow flex min-h-0">
        <div className="border-r border-[#B3B3B3] flex-1 min-w-[320px] flex flex-col">
          <div className="flex-grow overflow-y-auto" ref={messagesContainerRef}>
            <Messages
              messagesContainerRef={messagesContainerRef}
              onScrollButtonChange={setScrollButton}
            />
          </div>
          <MessageInput
            scrollButton={scrollButton}
            handleScrollToBottom={handleScrollToBottom}
          />
        </div>
        <PagerSidebar
          roomId={id}
          user={user}
          joinRequests={joinRequests}
          setJoinRequests={setJoinRequests}
        />
      </div>
    </div>
  );
};

export default Pager;
