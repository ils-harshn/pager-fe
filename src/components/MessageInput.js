import socket from "../socket";
import { useState, useRef, useEffect } from "react";
import { IoIosSend } from "react-icons/io";

const MessageInput = () => {
  const MAX_HEIGHT = 400;
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("message", message);
      setMessage("");
    }
  };

  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  const handleKeyDown = (e) => {
    if (!isMobileDevice()) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, MAX_HEIGHT);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="border-[#831d8d] border-t bg-[#2c0e2f]">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <textarea
          ref={textareaRef}
          className={`bg-[transparent] outline-none text-base text-white placeholder:text-[#b1b1b1] px-4 py-3 min-h-[100px] max-h-[${MAX_HEIGHT}px] overflow-y-auto resize-none`}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <div className="flex items-end justify-end border-t border-[#831d8d]">
          <div className="pr-2 py-2">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 text-white px-5 py-2 bg-[#2d4fb5] rounded-full"
            >
              <p>Send</p>
              <IoIosSend className="text-xl" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
