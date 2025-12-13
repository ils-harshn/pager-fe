import { MdClose, MdImage, MdInsertDriveFile } from "react-icons/md";

const FilePreview = ({ fileObj, onRemove }) => {
  const isImage = fileObj.file.type.startsWith("image/");

  return (
    <div className="flex-shrink-0 relative pt-2 pr-2">
      <button
        type="button"
        onClick={() => onRemove(fileObj.id)}
        className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 z-10 shadow-lg"
      >
        <MdClose className="text-xs" />
      </button>

      {isImage ? (
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
          <p
            className="text-white text-[9px] truncate w-full text-center px-1"
            title={fileObj.file.name}
          >
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
};

export default FilePreview;
