import socket from "../socket";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IoIosSend, IoMdAttach } from "react-icons/io";
import { MdClose, MdImage, MdInsertDriveFile } from "react-icons/md";
import { SOCKET_EVENTS, API_ENDPOINTS } from "../constants";
import { isMobileDevice } from "../utils";
import config from "../config";

const MessageInput = () => {
  const MAX_HEIGHT = 400;
  const { id: roomId } = useParams(); // Get roomId from URL path params
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    const filesWithProgress = validFiles.map((file) => ({
      file,
      progress: 0,
      preview: null,
      id: Math.random().toString(36).substr(2, 9),
    }));

    // Generate previews for images and gifs
    filesWithProgress.forEach((fileObj) => {
      if (fileObj.file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id ? { ...f, preview: e.target.result } : f
            )
          );
        };
        reader.readAsDataURL(fileObj.file);
      }
    });

    setSelectedFiles((prev) => [...prev, ...filesWithProgress]);
  };

  const handleRemoveFile = (fileId) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const uploadFile = async (fileObj) => {
    const formData = new FormData();
    formData.append("file", fileObj.file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setSelectedFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id ? { ...f, progress } : f
            )
          );
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve(data.file);
        } else {
          reject(new Error("File upload failed"));
        }
      };

      xhr.onerror = () => reject(new Error("File upload failed"));

      const url = roomId 
        ? `${config.uri}${API_ENDPOINTS.UPLOAD_FILE}?roomId=${roomId}`
        : `${config.uri}${API_ENDPOINTS.UPLOAD_FILE}`;
      xhr.open("POST", url);
      xhr.send(formData);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() && selectedFiles.length === 0) {
      return;
    }

    try {
      setUploading(true);
      let uploadedFiles = [];

      if (selectedFiles.length > 0) {
        uploadedFiles = await Promise.all(
          selectedFiles.map((fileObj) => uploadFile(fileObj))
        );
      }

      socket.emit(SOCKET_EVENTS.MESSAGE, {
        msg: message,
        files: uploadedFiles,
      });

      setMessage("");
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setUploading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!isMobileDevice()) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, MAX_HEIGHT);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const isImage = (file) => file.type.startsWith("image/");

  return (
    <div className="border-[#831d8d] border-t bg-[#2c0e2f]">
      <form onSubmit={handleSubmit} className="flex flex-col">
        {selectedFiles.length > 0 && (
          <div className="px-4 pt-2 pb-2 bg-[#3d1a42] border-b border-[#831d8d]">
            <div className="flex gap-1 overflow-x-auto pb-2">
              {selectedFiles.map((fileObj) => {
                const isImg = isImage(fileObj.file);
                return (
                  <div
                    key={fileObj.id}
                    className="flex-shrink-0 relative pt-2 pr-2"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(fileObj.id)}
                      className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 z-10 shadow-lg"
                    >
                      <MdClose className="text-xs" />
                    </button>
                    
                    {isImg ? (
                      <div className="w-14 h-14 rounded-lg border border-[#831d8d] hover:border-[#a842b5] overflow-hidden bg-black/40 transition-all">
                        {fileObj.preview ? (
                          <img
                            src={fileObj.preview}
                            alt={fileObj.file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MdImage className="text-white/60 text-3xl" />
                          </div>
                        )}
                        {fileObj.progress > 0 && fileObj.progress < 100 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 h-1.5">
                            <div
                              className="bg-[#a842b5] h-full transition-all duration-300"
                              style={{ width: `${fileObj.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-[#2c0e2f] rounded-lg border border-[#831d8d] hover:border-[#a842b5] transition-all flex flex-col items-center justify-center gap-1 p-2 relative">
                        <MdInsertDriveFile className="text-3xl text-white/70" />
                        <p className="text-white text-[9px] truncate w-full text-center px-1" title={fileObj.file.name}>
                          {fileObj.file.name}
                        </p>
                        <p className="text-gray-400 text-[8px]">
                          {(fileObj.file.size / 1024).toFixed(1)} KB
                        </p>
                        {fileObj.progress > 0 && fileObj.progress < 100 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 h-1.5 rounded-b-lg">
                            <div
                              className="bg-[#a842b5] h-full rounded-bl-lg transition-all duration-300"
                              style={{ width: `${fileObj.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <textarea
          ref={textareaRef}
          className={`bg-[transparent] outline-none text-base text-white placeholder:text-[#b1b1b1] px-4 py-3 min-h-[100px] max-h-[${MAX_HEIGHT}px] overflow-y-auto resize-none`}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          disabled={uploading}
        />
        <div className="flex items-end justify-between border-t border-[#831d8d]">
          <div className="pl-2 py-2">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
              multiple
              disabled={uploading}
            />
            <label
              htmlFor="file-input"
              className={`flex items-center justify-center gap-2 text-white px-5 py-2 bg-[#5e2d64] rounded-full ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#703078]'}`}
            >
              <IoMdAttach className="text-xl" />
              <p>Attach</p>
            </label>
          </div>
          <div className="pr-2 py-2">
            <button
              type="submit"
              disabled={uploading || (!message.trim() && selectedFiles.length === 0)}
              className="flex items-center justify-center gap-2 text-white px-5 py-2 bg-[#2d4fb5] rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <p>{uploading ? "Uploading..." : "Send"}</p>
              <IoIosSend className="text-xl" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
