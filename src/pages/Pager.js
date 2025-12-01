import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";

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

  if (!connected) {
    return (
      <div>
        Connecting to room {id} as {username}...
      </div>
    );
  }

  if (socket.disconnected) {
    return <div>Disconnected. Please refresh the page to reconnect.</div>;
  }

  return (
    <div>
      <ListConnectedUsers roomId={id} />
      <MessageInput />
      <Messages />
    </div>
  );
};

export default Pager;
