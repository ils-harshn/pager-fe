import { isMobileDevice } from "../../utils";

const MessageTextarea = ({ 
  textareaRef, 
  message, 
  onChange, 
  onSubmit, 
  disabled,
  maxHeight = 400 
}) => {
  const handleKeyDown = (e) => {
    if (!isMobileDevice()) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit(e);
      }
    }
  };

  return (
    <textarea
      ref={textareaRef}
      className={`bg-[transparent] outline-none text-base text-white placeholder:text-[#b1b1b1] px-4 py-3 min-h-[100px] max-h-[${maxHeight}px] overflow-y-auto resize-none`}
      placeholder="Type a message..."
      value={message}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      autoFocus
      disabled={disabled}
    />
  );
};

export default MessageTextarea;
