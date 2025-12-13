import { useState } from "react";
import { 
  MdInsertDriveFile, 
  MdPictureAsPdf, 
  MdAudioFile,
  MdVideoFile,
  MdTableChart,
  MdDescription,
  MdFolderZip,
  MdCode,
  MdTextSnippet
} from "react-icons/md";
import config from "../../config";
import FilePreviewModal from "./FilePreviewModal";

const getFileIcon = (fileName) => {
  const name = fileName.toLowerCase();
  const extension = name.split('.').pop();
  
  // PDF
  if (extension === 'pdf') return MdPictureAsPdf;
  
  // Audio files
  if (['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'].includes(extension)) return MdAudioFile;
  
  // Video files
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'].includes(extension)) return MdVideoFile;
  
  // Spreadsheets
  if (['xlsx', 'xls', 'csv', 'ods'].includes(extension)) return MdTableChart;
  
  // Documents
  if (['doc', 'docx', 'odt', 'rtf'].includes(extension)) return MdDescription;
  
  // Archives
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(extension)) return MdFolderZip;
  
  // Code files
  if (['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs', 'swift', 'kt'].includes(extension)) return MdCode;
  
  // Text files
  if (['txt', 'md', 'json', 'xml', 'yml', 'yaml', 'log'].includes(extension)) return MdTextSnippet;
  
  // Default
  return MdInsertDriveFile;
};

const FileAttachment = ({ file }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileUrl = `${config.uri}${file.url}`;
  const isImage = file.mimetype?.startsWith("image/");
  const FileIcon = getFileIcon(file.originalname);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (isImage) {
    return (
      <>
        <div 
          onClick={openModal}
          className="inline-block mr-2 mb-2 cursor-pointer"
        >
          <div className="w-24 h-24 rounded-lg border border-white/30 hover:border-white/50 transition-all overflow-hidden bg-black/40">
            <img
              src={fileUrl}
              alt={file.originalname}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <FilePreviewModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          file={file}
          fileUrl={fileUrl}
        />
      </>
    );
  }

  return (
    <>
      <div
        onClick={openModal}
        className="inline-block mr-2 mb-2 cursor-pointer"
      >
        <div className="w-24 h-24 flex flex-col items-center justify-center gap-1 p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/30 hover:border-white/50 transition-all">
          <FileIcon className="text-3xl text-white/70" />
          <span className="text-[9px] text-white text-center truncate w-full px-1" title={file.originalname}>
            {file.originalname}
          </span>
          <span className="text-[8px] text-white/60">
            {(file.size / 1024).toFixed(1)} KB
          </span>
        </div>
      </div>
      <FilePreviewModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        file={file}
        fileUrl={fileUrl}
      />
    </>
  );
};

export default FileAttachment;
