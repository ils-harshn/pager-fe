import { useState, useEffect } from "react";
import socket from "../../socket";
import { SOCKET_EVENTS } from "../../constants";
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaHome, 
  FaUserPlus, 
  FaUserMinus, 
  FaUserTimes, 
  FaBell 
} from "react-icons/fa";

const RoomLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const handleUpdateLogs = (data) => {
      setLogs(data.logs);
    };

    socket.on(SOCKET_EVENTS.UPDATE_LOGS, handleUpdateLogs);

    return () => {
      socket.off(SOCKET_EVENTS.UPDATE_LOGS, handleUpdateLogs);
    };
  }, []);

  const getLogIcon = (type) => {
    const iconClass = "text-base";
    switch (type) {
      case "room_created":
        return <FaHome className={`${iconClass} text-[#4ade80]`} />;
      case "user_joined":
        return <FaUserPlus className={`${iconClass} text-[#3b82f6]`} />;
      case "user_left":
        return <FaUserMinus className={`${iconClass} text-[#f59e0b]`} />;
      case "user_kicked":
        return <FaUserTimes className={`${iconClass} text-[#ef4444]`} />;
      case "join_request":
        return <FaBell className={`${iconClass} text-[#a855f7]`} />;
      default:
        return <FaBell className={`${iconClass} text-[#6b7280]`} />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const dateStr = date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
    return `${dateStr} ${time}`;
  };

  const reversedLogs = [...logs].reverse();

  return (
    <>
      <div
        className="border-[#FFD43B] border-b border-t bg-[#b7c12a] px-5 py-2 cursor-pointer hover:bg-[#a8b326] flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-white font-bold">Room Logs</h3>
        {isExpanded ? (
          <FaChevronUp className="text-white" />
        ) : (
          <FaChevronDown className="text-white" />
        )}
      </div>
      {isExpanded && (
        <div className="border-[#c2c2c2] border-b">
          <ul>
            {logs.length === 0 ? (
              <li className="px-5 py-3 text-[#b1b1b1] text-sm text-center">
                No activity yet
              </li>
            ) : (
              reversedLogs.map((log, index) => (
                <li
                  key={index}
                  className="border-[#B3B3B3] border-b last:border-b-0 px-5 py-2"
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">{getLogIcon(log.type)}</div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{log.message}</p>
                      <p className="text-[#b1b1b1] text-xs mt-1">
                        {formatTime(log.timestamp)}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default RoomLogs;
