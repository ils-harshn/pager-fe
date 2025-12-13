import { useEffect, useState } from "react";
import socket from "../socket";
import { SOCKET_EVENTS } from "../constants";
import { formatTime, groupMessages } from "../utils";
import { IoMdDownload, IoMdDocument } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";
import config from "../config";

function Messages({ messagesContainerRef }) {
  const [messages, setMessages] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  const isUserAtBottom = () => {
    if (!messagesContainerRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 50;
  };

  const scrollToBottom = (behavior = "smooth") => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: behavior,
      });
    }
  };

  const handleScroll = () => {
    const atBottom = isUserAtBottom();
    setShowScrollButton(!atBottom);
    if (atBottom) {
      setNewMessagesCount(0);
    }
  };

  const handleScrollButtonClick = () => {
    scrollToBottom("smooth");
    setNewMessagesCount(0);
    setShowScrollButton(false);
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
        // User is at bottom, auto-scroll
        requestAnimationFrame(() => {
          scrollToBottom("auto");
        });
      } else {
        // User is reading older messages, show notification
        setNewMessagesCount((prev) => prev + 1);
        setShowScrollButton(true);
      }
    }
    socket.on(SOCKET_EVENTS.MESSAGE, handleMessage);
    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE, handleMessage);
    };
  }, []);

  useEffect(() => {
    // Attach scroll listener
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      // Initial scroll to bottom when component mounts
      setTimeout(() => scrollToBottom("auto"), 100);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
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

  return (
    <div className="relative h-full">
      <div className="space-y-4 px-4 py-4">
        {groupedMessages.map((group, groupIndex) => {
          const { time, dateStr } = formatTime(group.at);
          const isOwnMessage = group?.id === socket.id;
          
          return (
            <div key={groupIndex} className={`flex flex-col gap-1.5 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
              {/* Header with avatar, username, and timestamp */}
              <div className={`flex items-center gap-2 px-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: group.avatar?.color }}
                >
                  {group.avatar?.emoji}
                </div>
                <div className={`flex items-baseline gap-2 flex-wrap ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span
                    className={`${
                      isOwnMessage ? "text-yellow-400" : "text-green-400"
                    } font-semibold text-sm`}
                  >
                    {isOwnMessage ? "You" : group.username}
                  </span>
                  <span className="text-white/50 text-xs">
                    {time} • {dateStr}
                  </span>
                </div>
              </div>

              {/* Messages container */}
              <div className={`flex flex-col gap-2 ${isOwnMessage ? 'items-end' : 'items-start'} w-full`}>
                {group.messages.map((message, msgIndex) => (
                  <div 
                    key={msgIndex} 
                    className={`rounded-2xl px-4 py-2.5 max-w-[85%] ${
                      isOwnMessage 
                        ? "bg-gradient-to-br from-yellow-600/20 to-yellow-700/30 border border-yellow-600/30 mr-2" 
                        : "bg-gradient-to-br from-green-600/20 to-green-700/30 border border-green-600/30 ml-2"
                    } backdrop-blur-sm shadow-lg`}
                  >
                    {message.msg && (
                      <div
                        className={`${
                          isOwnMessage ? "text-yellow-100" : "text-green-100"
                        } text-sm leading-relaxed whitespace-pre-wrap break-words`}
                      >
                        {message.msg}
                      </div>
                    )}
                    {message.files && message.files.length > 0 && (
                      <div className={`flex flex-wrap gap-2 ${message.msg ? 'mt-3' : ''}`}>
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
        })}
      </div>

      {/* Floating scroll to bottom button */}
      {showScrollButton && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={handleScrollButtonClick}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-2xl transition-all duration-200 flex items-center gap-2 hover:scale-105"
          >
            <MdKeyboardArrowDown className="text-2xl" />
            {newMessagesCount > 0 && (
              <span className="text-sm font-semibold pr-1">
                {newMessagesCount} new
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default Messages;
