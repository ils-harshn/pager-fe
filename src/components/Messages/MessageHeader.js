import Avatar from "../common/Avatar";

const MessageHeader = ({ avatar, username, isOwnMessage }) => {
  return (
    <div className={`flex items-center gap-2 px-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar avatar={avatar} size="small" />
      <span
        className={`${
          isOwnMessage ? "text-yellow-400" : "text-green-400"
        } font-semibold text-sm`}
      >
        {isOwnMessage ? "You" : username}
      </span>
    </div>
  );
};

export default MessageHeader;
