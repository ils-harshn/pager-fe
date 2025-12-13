import { IoMdAttach } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import EmojiPickerButton from "./EmojiPickerButton";

const MessageInputActions = ({ 
  fileInputRef,
  onFileSelect,
  uploading,
  emojiPickerRef,
  showEmojiPicker,
  onToggleEmojiPicker,
  onEmojiClick,
  onSubmit,
  canSend
}) => {
  return (
    <div className="flex items-end justify-between border-t border-[#831d8d]">
      <div className="pl-2 py-2 flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          onChange={onFileSelect}
          className="hidden"
          id="file-input"
          multiple
          disabled={uploading}
        />
        <label
          htmlFor="file-input"
          className={`flex items-center justify-center gap-2 text-white px-5 py-2 bg-[#5e2d64] rounded-full ${
            uploading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-[#703078]"
          }`}
        >
          <IoMdAttach className="text-xl" />
          <p>Attach</p>
        </label>
        
        <EmojiPickerButton
          emojiPickerRef={emojiPickerRef}
          showEmojiPicker={showEmojiPicker}
          onToggle={onToggleEmojiPicker}
          onEmojiClick={onEmojiClick}
          disabled={uploading}
        />
      </div>
      <div className="pr-2 py-2">
        <button
          type="submit"
          disabled={uploading || !canSend}
          className="flex items-center justify-center gap-2 text-white px-5 py-2 bg-[#2d4fb5] rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <p>{uploading ? "Uploading..." : "Send"}</p>
          <IoIosSend className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default MessageInputActions;
