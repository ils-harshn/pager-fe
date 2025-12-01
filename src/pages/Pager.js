import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../socket";
import { FaPager } from "react-icons/fa6";
import { FaClock } from "react-icons/fa6";
import { FaPowerOff } from "react-icons/fa6";
import ROUTES from "../router/ROUTES";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    socket.disconnect();
    navigate(ROUTES.INDEX);
  };

  return (
    <button
      onClick={handleLogout}
      className="px-5 py-2 border-l border-[#B3B3B3] flex items-center text-[#f0f0f0da] hover:text-white"
    >
      <FaPowerOff className="text-xl" />
    </button>
  );
};

const Links = () => {
  return (
    <>
      <a href="/" className="px-5 py-2 border-l border-[#B3B3B3] flex items-center text-[#f0f0f0da] hover:text-white">
        <p>COMMUNITY</p>
      </a>
      <a href="/" className="px-5 py-2 border-l border-[#B3B3B3] flex items-center text-[#f0f0f0da] hover:text-white">
        <p>ABOUT</p>
      </a>
    </>
  );
};

const Time = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="px-5 py-2 border-l border-[#B3B3B3] flex items-center">
        <FaClock className="text-xl text-[#f0f0f0da]" />
      </div>
      <div className="px-5 py-2 border-l border-[#B3B3B3] w-[110px]">
        <p className="text-xs text-[#f0f0f0da] text-center">
          {time.toLocaleTimeString([], { hour12: false })}
        </p>
        <p className="text-xs text-[#f0f0f0da] text-center">
          {time.toLocaleDateString()}
        </p>
      </div>
    </>
  );
};

const ListConnectedUsers = ({ roomId }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const handleUpdateUsers = (data) => {
      setUsers(data.users);
    };

    fetch(
      `${
        process.env.REACT_APP_API_URL
      }/get-connected-users?roomId=${encodeURIComponent(roomId)}`
    )
      .then((res) => {
        res.json().then((data) => {
          handleUpdateUsers(data);
        });
      })
      .catch((err) => {
        console.error("Failed to fetch connected users:", err);
      })
      .finally(() => {
        socket.on("updateUsers", handleUpdateUsers);
      });

    return () => {
      socket.off("updateUsers", handleUpdateUsers);
    };
  }, [roomId]);

  return (
    <div>
      <h3>Connected Users:</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

const MessageInput = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        autoFocus
      />
      <button type="submit">Send</button>
    </form>
  );
};

function Messages() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    function handleMessage({ userName, msg }) {
      setMessages((prevMessages) => [...prevMessages, { userName, msg }]);
    }
    socket.on("message", handleMessage);
    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  return (
    <div>
      {messages.map((m, index) => (
        <div key={index}>
          <strong>{m.userName}:</strong> {m.msg}
        </div>
      ))}
    </div>
  );
}

const Pager = () => {
  const { id, username } = useParams();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    function handleConnect() {
      setConnected(true);
      socket.emit("joinRoom", { roomId: id, userName: username });
    }

    function handleDisconnect() {
      setConnected(false);
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socket.connect();
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };
  }, [id, username]);

  if (!connected || socket.disconnected) {
    return (
      <div className="mx-auto max-w-[1440px] h-[100dvh] border-l border-r border-[#B3B3B3] flex flex-col items-center justify-center gap-2">
        {!connected ? (
          <p className="text-white">
            Connecting to room{" "}
            <span className="text-[#1596ff] font-bold">{id}</span> as{" "}
            <span className="text-[#FFD43B] font-bold">{username}</span>...
          </p>
        ) : null}
        {socket.disconnected ? (
          <p className="text-white">
            Disconnected. Please refresh the page to reconnect.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] h-[100dvh] border-l border-r border-[#B3B3B3]">
      <header className="border-[#B3B3B3] border-b bg-[#2D2D2D] flex justify-between">
        <div className="flex items-center">
          <div className="border-r border-[#B3B3B3] px-5 py-2 flex items-center">
            <FaPager className="text-4xl text-[#FFD43B]" />
          </div>
          <div className="px-5 py-2 flex items-center border-r border-[#B3B3B3]">
            <h3 className="text-3xl text-[#1596ff] font-kosugi">Pager</h3>
          </div>
        </div>
        <div className="flex">
          <Links />
          <Time />
          <Logout />
        </div>
      </header>
      <ListConnectedUsers roomId={id} />
      <MessageInput />
      <Messages />
    </div>
  );
};

export default Pager;
