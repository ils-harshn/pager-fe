import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../socket";
import { FaPager } from "react-icons/fa6";
import { FaClock } from "react-icons/fa6";
import { FaPowerOff } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
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
      <a
        href="/"
        className="px-5 py-2 border-l border-[#B3B3B3] flex items-center text-[#f0f0f0da] hover:text-white"
      >
        <p>COMMUNITY</p>
      </a>
      <a
        href="/"
        className="px-5 py-2 border-l border-[#B3B3B3] flex items-center text-[#f0f0f0da] hover:text-white"
      >
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

const ListConnectedUsers = ({ roomId, loggedUser }) => {
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
    <>
      <div className="border-[#f23bff] border-b bg-[#992ac1] px-5 py-2">
        <h3 className="text-white font-bold">Room Members</h3>
      </div>
      <div>
        <ul>
          {users
            .filter((user) => user.id !== loggedUser?.id)
            .map((user, index) => (
              <li
                key={index}
                className="border-[#B3B3B3] border-b flex justify-between items-center"
              >
                <div className="px-5 py-2">
                  <p className="text-white">{user.username}{user?.owner ? " (Moderator)" : ""}</p>
                </div>
              </li>
            ))}
          <li className="border-[#B3B3B3] border-b flex justify-between items-center">
            <div className="px-5 py-2">
              <p className="text-white">{loggedUser.username} (You){loggedUser?.owner ? " (Moderator)": ""}</p>
            </div>
          </li>
        </ul>
      </div>
    </>
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

const ShowJoinRequests = ({ requests, setJoinRequests }) => {
  const approveJoin = (socketId) => {
    socket.emit("approveJoin", { socketId });
    setJoinRequests((prevRequests) =>
      prevRequests.filter((request) => request.socketId !== socketId)
    );
  };

  const rejectJoin = (socketId) => {
    setJoinRequests((prevRequests) =>
      prevRequests.filter((request) => request.socketId !== socketId)
    );
  };

  return (
    <>
      <div className="border-[#FFD43B] border-b bg-[#b7c12a] px-5 py-2">
        <h3 className="text-white font-bold">Join Requests</h3>
      </div>
      <div>
        <ul>
          {requests.map((request, index) => (
            <li
              key={index}
              className="border-[#B3B3B3] border-b flex justify-between items-center"
            >
              <div className="px-5 py-2">
                <p className="text-white">{request.username}</p>
              </div>
              <div className="flex items-center gap-2 pr-1">
                <button
                  onClick={() => approveJoin(request.socketId)}
                  className="bg-[#03d506] px-3 py-1 text-white rounded-full text-nowrap text-sm font-bold"
                  type="submit"
                >
                  Approve
                </button>
                <button
                  onClick={() => rejectJoin(request.socketId)}
                  className="bg-[#d53703] px-3 py-1 text-white rounded-full text-nowrap text-sm font-bold"
                  type="submit"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const Pager = () => {
  const { id, username } = useParams();
  const [connected, setConnected] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [user, setUser] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);

  useEffect(() => {
    function handleConnect() {
      setConnected(true);
      socket.emit("joinRoom", { roomId: id, username: username });
    }

    function handleDisconnect() {
      setConnected(false);
    }

    function hasJoinedRoom(data) {
      setUser(data);
      setJoinedRoom(true);
    }

    function onJoinRequest({ username, socketId }) {
      setJoinRequests((prevRequests) => [
        ...prevRequests,
        { username, socketId },
      ]);
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("joinedRoom", hasJoinedRoom);
    socket.on("joinrequest", onJoinRequest);

    socket.connect();
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("joinedRoom", hasJoinedRoom);
      socket.off("joinrequest", onJoinRequest);
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

  if (!joinedRoom) {
    return (
      <div className="mx-auto max-w-[1440px] h-[100dvh] border-l border-r border-[#B3B3B3] flex flex-col items-center justify-center gap-2">
        <p className="text-white">
          Waiting for the owner to let you in the room{" "}
          <span className="text-[#1596ff] font-bold">{id}</span>...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] h-[100dvh] border-l border-r border-[#B3B3B3] flex flex-col">
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
      <div className="flex-grow flex min-h-0">
        <div className="border-r border-[#B3B3B3] flex-1 min-w-[320px] flex flex-col">
          <div className="flex-grow overflow-y-auto pb-5">
            <Messages />
          </div>
          <MessageInput />
        </div>
        <div className="w-[320px] flex-1 min-w-[320px] max-w-[462px] overflow-y-auto">
          <div className="border-[#00ccff] border-b bg-[#368194] grid grid-cols-2">
            <div className="px-5 py-2">
              <div>
                <p className="text-[#f0f0f0da] text-xs font-semibold">
                  Room ID (Joined)
                </p>
              </div>
              <p className="truncate text-white font-bold">{id}</p>
            </div>
            <div className="border-l border-[#00ccff] px-5 py-2">
              <div>
                <p className="text-[#f0f0f0da] text-xs font-semibold">
                  Your username is
                </p>
              </div>
              <p className="truncate text-white font-bold">{user.username}</p>
            </div>
          </div>
          <ListConnectedUsers roomId={id} loggedUser={user} />
          {user?.owner && joinRequests?.length ? (
            <ShowJoinRequests
              requests={joinRequests}
              setJoinRequests={setJoinRequests}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Pager;
