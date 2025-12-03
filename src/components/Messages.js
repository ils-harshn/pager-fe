import { useEffect, useState, useRef } from "react";
import socket from "../socket";

function Messages() {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    function handleMessage({ id, username, msg, at }) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id, username, msg, at },
      ]);
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

  return (
    <div className="px-4 py-4">
      {groupedMessages.map((group, groupIndex) => {
        const { time, dateStr } = formatTime(group.at);
        return (
          <div key={groupIndex} className="mb-4">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[#FFD43B] font-semibold text-sm">
                {console.log(group.id, socket.id)}
                {group?.id === socket.id ? "You" : group.username}
              </span>
              <span className="text-[#b1b1b1] text-xs">{time}</span>
              <span className="text-[#888888] text-xs">{dateStr}</span>
            </div>
            <div className="pl-1">
              {group.messages.map((message, msgIndex) => (
                <div
                  key={msgIndex}
                  className="text-white text-base whitespace-pre-wrap break-words mb-1"
                >
                  {message.msg}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default Messages;
