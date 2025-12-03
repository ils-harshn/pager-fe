import { useEffect, useState } from "react";
import socket from "../socket";

function Messages() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    function handleMessage({ username, msg }) {
      setMessages((prevMessages) => [...prevMessages, { username, msg }]);
    }
    socket.on("message", handleMessage);
    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  if (!messages?.length) {
    return (
      <div className="px-5 py-5 flex items-center justify-center h-full">
        <p className="text-white">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div>
      {messages.map((message, index) => {
        return <div key={index}>{message.msg}</div>;
      })}
    </div>
  );
}

export default Messages;
