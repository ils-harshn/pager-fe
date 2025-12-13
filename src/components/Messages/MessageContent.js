import FileAttachment from "./FileAttachment";

const MessageContent = ({ message, isOwnMessage, isFirst }) => {
  const textColor = isOwnMessage ? "text-yellow-100" : "text-green-100";
  
  return (
    <div>
      {message.msg && (
        <div
          className={`${textColor} text-sm leading-relaxed whitespace-pre-wrap break-words ${
            !isFirst ? 'mt-2' : ''
          }`}
        >
          {message.msg}
        </div>
      )}
      {message.files && message.files.length > 0 && (
        <div className={`flex flex-wrap gap-2 ${message.msg ? 'mt-3' : !isFirst ? 'mt-2' : ''}`}>
          {message.files.map((file, fileIndex) => (
            <FileAttachment key={fileIndex} file={file} files_length={message.files.length} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageContent;
