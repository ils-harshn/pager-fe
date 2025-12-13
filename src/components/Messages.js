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
        <div className="inline-block mr-2 mb-2">
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <div className="w-32 h-32 rounded-lg border-2 border-white/20 hover:border-white/40 transition-all overflow-hidden bg-black/30">
              <img
                src={fileUrl}
                alt={file.originalname}
                className="w-full h-full object-cover cursor-pointer"
              />
            </div>
          </a>
          <a
            href={fileUrl}
            download={file.originalname}
            className="flex items-center gap-1 text-[10px] text-white/70 hover:text-white mt-1"
          >
            <IoMdDownload className="text-xs" />
            <span className="truncate max-w-[120px]" title={file.originalname}>
              {file.originalname}
            </span>
          </a>
        </div>
      );
    }

    return (
      <div className="inline-block mr-2 mb-2">
        <a
          href={fileUrl}
          download={file.originalname}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-white/40 transition-all max-w-[200px]"
        >
          <IoMdDocument className="text-xl flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs truncate" title={file.originalname}>
              {file.originalname}
            </span>
            <span className="text-[10px] text-white/60">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
          <IoMdDownload className="text-lg flex-shrink-0" />
        </a>
      </div>
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
