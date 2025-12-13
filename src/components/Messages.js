import { useEffect, useState } from "react";
import socket from "../socket";
import { SOCKET_EVENTS } from "../constants";
import { groupMessages } from "../utils";
import { useMessageScroll } from "../hooks";
import MessageGroup from "./Messages/MessageGroup";
import EmptyMessages from "./Messages/EmptyMessages";

function Messages({ messagesContainerRef, onScrollButtonChange }) {
  const [messages, setMessages] = useState([]);
  
  const { 
    isUserAtBottom, 
    scrollToBottom, 
    incrementNewMessages 
  } = useMessageScroll(messagesContainerRef, onScrollButtonChange);

  useEffect(() => {
    function handleMessage({ id, username, msg, at, avatar, files }) {
      const wasAtBottom = isUserAtBottom();
      setMessages((prevMessages) => [
        ...prevMessages,
        { id, username, msg, at, avatar, files: files || [] },
      ]);

      if (wasAtBottom) {
        requestAnimationFrame(() => {
          scrollToBottom("auto");
        });
      } else {
        incrementNewMessages();
      }
    }
    socket.on(SOCKET_EVENTS.MESSAGE, handleMessage);
    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE, handleMessage);
    };
  }, [isUserAtBottom, scrollToBottom, incrementNewMessages]);

  if (!messages?.length) {
    return <EmptyMessages />;
  }

  const groupedMessages = groupMessages(messages);

  return (
    <div className="h-full">
      <div className="space-y-4 px-4 py-4">
        {groupedMessages.map((group, groupIndex) => {
          const isOwnMessage = group?.id === socket.id;
          return (
            <MessageGroup 
              key={groupIndex} 
              group={group} 
              isOwnMessage={isOwnMessage} 
            />
          );
        })}
      </div>
    </div>
  );
}

export default Messages;
