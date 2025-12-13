import { useState } from "react";
import { API_ENDPOINTS } from "../constants";
import config from "../config";

const useFileUpload = (roomId) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      if (file.size > 1000 * 1024 * 1024) {
        alert(`${file.name} exceeds 1000MB limit`);
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

    // Generate previews for images
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
            prev.map((f) => (f.id === fileObj.id ? { ...f, progress } : f))
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

  const uploadAllFiles = async () => {
    if (selectedFiles.length === 0) return [];
    
    setUploading(true);
    try {
      const uploadedFiles = await Promise.all(
        selectedFiles.map((fileObj) => uploadFile(fileObj))
      );
      return uploadedFiles;
    } finally {
      setUploading(false);
    }
  };

  const clearFiles = () => {
    setSelectedFiles([]);
  };

  return {
    selectedFiles,
    uploading,
    handleFileSelect,
    handleRemoveFile,
    uploadAllFiles,
    clearFiles,
  };
};

export default useFileUpload;
