import { useEffect, useState } from "react";
import socket from "../socket";
import { SOCKET_EVENTS } from "../constants";
import { formatTime, groupMessages } from "../utils";
import { IoMdDownload, IoMdDocument } from "react-icons/io";
import config from "../config";

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

  const isImageFile = (mimetype) => {
    return mimetype?.startsWith("image/");
  };

  const FileAttachment = ({ file }) => {
    const fileUrl = `${config.uri}${file.url}`;
    const isImage = isImageFile(file.mimetype);

    if (isImage) {
      return (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="inline-block mr-2 mb-2">
          <div className="w-24 h-24 rounded-lg border border-white/30 hover:border-white/50 transition-all overflow-hidden bg-black/40 cursor-pointer">
            <img
              src={fileUrl}
              alt={file.originalname}
              className="w-full h-full object-cover"
            />
          </div>
        </a>
      );
    }

    return (
      <a
        href={fileUrl}
        target="_blank"
        className="inline-block mr-2 mb-2"
      >
        <div className="w-24 h-24 flex flex-col items-center justify-center gap-1 p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/30 hover:border-white/50 transition-all">
          <IoMdDocument className="text-3xl text-white/70" />
          <span className="text-[9px] text-white text-center truncate w-full px-1" title={file.originalname}>
            {file.originalname}
          </span>
          <span className="text-[8px] text-white/60">
            {(file.size / 1024).toFixed(1)} KB
          </span>
        </div>
      </a>
    );
  };

  useEffect(() => {
    function handleMessage({ id, username, msg, at, avatar, files }) {
      const wasAtBottom = isUserAtBottom();
      setMessages((prevMessages) => [
        ...prevMessages,
        { id, username, msg, at, avatar, files: files || [] },
      ]);

      if (wasAtBottom) {
        setTimeout(() => {
          scrollToBottom();
        }, 0);
      }
    }
    socket.on(SOCKET_EVENTS.MESSAGE, handleMessage);
    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE, handleMessage);
    };
  }, []);

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
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0"
            style={{ backgroundColor: group.avatar?.color }}
          >
            {group.avatar?.emoji}
          </div>
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
            <div key={msgIndex} className="mb-2">
              {message.msg && (
                <div
                  className={`${
                    socket.id === group.id ? "text-[#FFD43B]" : "text-[#3bff3e]"
                  } font-semibold text-base whitespace-pre-wrap break-words mb-2`}
                >
                  {message.msg}
                </div>
              )}
              {message.files && message.files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {message.files.map((file, fileIndex) => (
                    <FileAttachment key={fileIndex} file={file} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  });
}

export default Messages;
