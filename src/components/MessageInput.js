import socket from "../socket";
import { useState } from "react";
import { IoIosSend } from "react-icons/io";

const MessageInput = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    setMessage("");
  };

  return (
    <div className="border-[#831d8d] border-t bg-[#2c0e2f]">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <textarea
          className="bg-[transparent] outline-none text-base text-white placeholder:text-[#b1b1b1] px-4 py-3 min-h-[100px]"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
