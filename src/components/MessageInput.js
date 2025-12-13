import socket from "../socket";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { SOCKET_EVENTS } from "../constants";
import { 
  useFileUpload, 
  useAutoResizeTextarea, 
  useEmojiPicker 
} from "../hooks";
import ScrollToBottomButton from "./MessageInput/ScrollToBottomButton";
import FileAttachmentsList from "./MessageInput/FileAttachmentsList";
import MessageTextarea from "./MessageInput/MessageTextarea";
import MessageInputActions from "./MessageInput/MessageInputActions";

const MessageInput = ({ scrollButton, handleScrollToBottom }) => {
  const MAX_HEIGHT = 400;
  const { id: roomId } = useParams();
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const {
    selectedFiles,
    uploading,
    handleFileSelect,
    handleRemoveFile,
    uploadAllFiles,
    clearFiles,
  } = useFileUpload(roomId);

  const { textareaRef } = useAutoResizeTextarea(message, MAX_HEIGHT);

  const {
    showEmojiPicker,
    emojiPickerRef,
    toggleEmojiPicker,
    closeEmojiPicker,
  } = useEmojiPicker();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() && selectedFiles.length === 0) {
      return;
    }

    try {
      const uploadedFiles = await uploadAllFiles();

      socket.emit(SOCKET_EVENTS.MESSAGE, {
        msg: message,
        files: uploadedFiles,
      });

      setMessage("");
      clearFiles();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    closeEmojiPicker();
    textareaRef.current?.focus();
  };

  const canSend = message.trim() || selectedFiles.length > 0;

  return (
    <div className="border-[#831d8d] border-t bg-[#2c0e2f] relative">
      <ScrollToBottomButton 
        scrollButton={scrollButton} 
        onClick={handleScrollToBottom} 
      />
      
      <form onSubmit={handleSubmit} className="flex flex-col">
        <FileAttachmentsList 
          selectedFiles={selectedFiles} 
          onRemoveFile={handleRemoveFile} 
        />
        
        <MessageTextarea
          textareaRef={textareaRef}
          message={message}
          onChange={(e) => setMessage(e.target.value)}
          onSubmit={handleSubmit}
          disabled={uploading}
          maxHeight={MAX_HEIGHT}
        />
        
        <MessageInputActions
          fileInputRef={fileInputRef}
          onFileSelect={handleFileSelect}
          uploading={uploading}
          emojiPickerRef={emojiPickerRef}
          showEmojiPicker={showEmojiPicker}
          onToggleEmojiPicker={toggleEmojiPicker}
          onEmojiClick={handleEmojiClick}
          onSubmit={handleSubmit}
          canSend={canSend}
        />
      </form>
    </div>
  );
};

export default MessageInput;
