import MessageContent from "./MessageContent";
import { formatTime } from "../../utils";

const MessageBubble = ({ timeGroup, isOwnMessage }) => {
  const { time, dateStr } = formatTime(timeGroup.at);
  
  const bubbleClasses = isOwnMessage 
    ? "bg-gradient-to-br from-yellow-600/20 to-yellow-700/30 border border-yellow-600/30 mr-2" 
    : "bg-gradient-to-br from-green-600/20 to-green-700/30 border border-green-600/30 ml-2";

  return (
    <div className={`flex flex-col gap-1 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
      <div className={`rounded-2xl px-4 py-2.5 max-w-[85%] ${bubbleClasses} backdrop-blur-sm shadow-lg`}>
        {timeGroup.messages.map((message, msgIndex) => (
          <MessageContent 
            key={msgIndex} 
            message={message} 
            isOwnMessage={isOwnMessage}
            isFirst={msgIndex === 0}
          />
        ))}
      </div>
      <span className={`text-white/50 text-xs px-2 ${isOwnMessage ? 'mr-2' : 'ml-2'}`}>
        {time} • {dateStr}
      </span>
    </div>
  );
};

export default MessageBubble;
