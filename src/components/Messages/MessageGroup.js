import MessageHeader from "./MessageHeader";
import MessageBubble from "./MessageBubble";

const MessageGroup = ({ group, isOwnMessage }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
      <MessageHeader 
        avatar={group.avatar} 
        username={group.username} 
        isOwnMessage={isOwnMessage} 
      />
      <div className={`flex flex-col gap-3 ${isOwnMessage ? 'items-end' : 'items-start'} w-full`}>
        {group.timeGroups.map((timeGroup, timeIndex) => (
          <MessageBubble 
            key={timeIndex} 
            timeGroup={timeGroup} 
            isOwnMessage={isOwnMessage} 
          />
        ))}
      </div>
    </div>
  );
};

export default MessageGroup;
