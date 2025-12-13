import { useEffect, useState } from "react";
import socket from "../socket";
import { SOCKET_EVENTS } from "../constants";
import { formatTime, groupMessages } from "../utils";
import { IoMdDownload, IoMdDocument } from "react-icons/io";
import config from "../config";

function Messages({ messagesContainerRef, onScrollButtonChange }) {
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
    const shouldShow = !atBottom;
    setShowScrollButton(shouldShow);
    if (atBottom) {
      setNewMessagesCount(0);
    }
    if (onScrollButtonChange) {
      onScrollButtonChange({ show: shouldShow, count: atBottom ? 0 : newMessagesCount });
    }
  };

  const handleScrollButtonClick = () => {
    scrollToBottom("smooth");
    setNewMessagesCount(0);
    setShowScrollButton(false);
    if (onScrollButtonChange) {
      onScrollButtonChange({ show: false, count: 0 });
    }
  };

  // Expose scrollToBottom to parent
  if (messagesContainerRef.current) {
    messagesContainerRef.current.scrollToBottomHandler = handleScrollButtonClick;
  }

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
        const newCount = newMessagesCount + 1;
        setNewMessagesCount(newCount);
        setShowScrollButton(true);
        if (onScrollButtonChange) {
          onScrollButtonChange({ show: true, count: newCount });
        }
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
    <div className="h-full">
      <div className="space-y-4 px-4 py-4">
        {groupedMessages.map((group, groupIndex) => {
          const isOwnMessage = group?.id === socket.id;
          
          return (
            <div key={groupIndex} className={`flex flex-col gap-1.5 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
              {/* Header with avatar and username */}
              <div className={`flex items-center gap-2 px-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: group.avatar?.color }}
                >
                  {group.avatar?.emoji}
                </div>
                <span
                  className={`${
                    isOwnMessage ? "text-yellow-400" : "text-green-400"
                  } font-semibold text-sm`}
                >
                  {isOwnMessage ? "You" : group.username}
                </span>
              </div>

              {/* Time groups - each with its own bubble */}
              <div className={`flex flex-col gap-3 ${isOwnMessage ? 'items-end' : 'items-start'} w-full`}>
                {group.timeGroups.map((timeGroup, timeIndex) => {
                  const { time, dateStr } = formatTime(timeGroup.at);
                  return (
                    <div key={timeIndex} className={`flex flex-col gap-1 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                      {/* Single bubble for all messages at this time */}
                      <div 
                        className={`rounded-2xl px-4 py-2.5 max-w-[85%] ${
                          isOwnMessage 
                            ? "bg-gradient-to-br from-yellow-600/20 to-yellow-700/30 border border-yellow-600/30 mr-2" 
                            : "bg-gradient-to-br from-green-600/20 to-green-700/30 border border-green-600/30 ml-2"
                        } backdrop-blur-sm shadow-lg`}
                      >
                        {timeGroup.messages.map((message, msgIndex) => (
                          <div key={msgIndex}>
                            {message.msg && (
                              <div
                                className={`${
                                  isOwnMessage ? "text-yellow-100" : "text-green-100"
                                } text-sm leading-relaxed whitespace-pre-wrap break-words ${
                                  msgIndex > 0 ? 'mt-2' : ''
                                }`}
                              >
                                {message.msg}
                              </div>
                            )}
                            {message.files && message.files.length > 0 && (
                              <div className={`flex flex-wrap gap-2 ${message.msg ? 'mt-3' : msgIndex > 0 ? 'mt-2' : ''}`}>
                                {message.files.map((file, fileIndex) => (
                                  <FileAttachment key={fileIndex} file={file} />
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {/* Timestamp below the bubble */}
                      <span className={`text-white/50 text-xs px-2 ${isOwnMessage ? 'mr-2' : 'ml-2'}`}>
                        {time} • {dateStr}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Messages;
