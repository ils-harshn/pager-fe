import { useEffect, useState, useRef } from "react";
import socket from "../socket";

function Messages({ messagesContainerRef }) {
  const [messages, setMessages] = useState([]);

  const isUserAtBottom = () => {
    if (!messagesContainerRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    function handleMessage({ id, username, msg, at }) {
      const wasAtBottom = isUserAtBottom();
      setMessages((prevMessages) => [
        ...prevMessages,
        { id, username, msg, at },
      ]);

      if (wasAtBottom) {
        // Use setTimeout to wait for DOM update
        setTimeout(() => {
          scrollToBottom();
        }, 0);
      }
    }
    socket.on("message", handleMessage);
    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const dateStr = date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
    return { time, dateStr };
  };

  const groupMessages = (messages) => {
    const groups = [];
    let currentGroup = null;

    messages.forEach((message) => {
      const shouldGroup =
        currentGroup &&
        currentGroup.username === message.username &&
        new Date(message.at).getTime() - new Date(currentGroup.at).getTime() <
          1 * 60 * 1000;
      if (shouldGroup) {
        currentGroup.messages.push(message);
      } else {
        currentGroup = {
          id: message.id,
          username: message.username,
          at: message.at,
          messages: [message],
        };
        groups.push(currentGroup);
      }
    });

    return groups;
  };

  if (!messages?.length) {
    return (
      <div className="px-5 py-5 flex items-center justify-center h-full">
        <p className="text-white">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  const groupedMessages = groupMessages(messages);

  return groupedMessages.map((group, groupIndex) => {
    const { time, dateStr } = formatTime(group.at);
    return (
      <div
        key={groupIndex}
        className={`last:mb-4 pt-2 ${
          group?.id === socket.id ? "bg-[#312a0f]" : "bg-[#0e320e]"
        }`}
      >
        <div className="flex items-baseline gap-2 mb-3 px-3">
          <span
            className={`${
              group?.id === socket.id ? "text-[#c7a62d]" : "text-[#32b834]"
            } font-semibold text-xs`}
          >
            {group?.id === socket.id ? "You" : group.username}
          </span>
          <span className="text-[#ffffff] text-[10px]">{time}</span>
          <span className="text-[#ffffff] text-[10px]">{dateStr}</span>
        </div>
        <div
          className={`border-b ${
            group?.id === socket.id ? "border-[#d4af28]" : "border-[#2baf2d]"
          } px-3 pb-2`}
        >
          {group.messages.map((message, msgIndex) => (
            <div
              key={msgIndex}
              className={`${
                socket.id === group.id ? "text-[#FFD43B]" : "text-[#3bff3e]"
              } font-semibold text-base whitespace-pre-wrap break-words mb-1`}
            >
              {message.msg}
            </div>
          ))}
        </div>
      </div>
    );
  });
}

export default Messages;
