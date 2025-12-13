import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";

const EmojiPickerButton = ({ 
  emojiPickerRef, 
  showEmojiPicker, 
  onToggle, 
  onEmojiClick, 
  disabled 
}) => {
  return (
    <div className="relative" ref={emojiPickerRef}>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`flex items-center justify-center gap-2 text-white px-3 py-2 bg-[#5e2d64] rounded-full ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-[#703078]"
        }`}
      >
        <BsEmojiSmile className="text-xl" />
      </button>
      
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 mb-2 z-50">
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            theme="dark"
            width={320}
            height={400}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerButton;
