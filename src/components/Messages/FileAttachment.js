import { IoMdDocument } from "react-icons/io";
import config from "../../config";

const FileAttachment = ({ file }) => {
  const fileUrl = `${config.uri}${file.url}`;
  const isImage = file.mimetype?.startsWith("image/");

  if (isImage) {
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="inline-block mr-2 mb-2">
        <div className="w-24 h-24 rounded-lg border border-white/30 hover:border-white/50 transition-all overflow-hidden bg-black/40 cursor-pointer">
          <img
            src={fileUrl}
            alt={file.originalname}
            className="w-full h-full object-cover"
          />
        </div>
      </a>
    );
  }

  return (
    <a
      href={fileUrl}
      target="_blank"
      className="inline-block mr-2 mb-2"
    >
      <div className="w-24 h-24 flex flex-col items-center justify-center gap-1 p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/30 hover:border-white/50 transition-all">
        <IoMdDocument className="text-3xl text-white/70" />
        <span className="text-[9px] text-white text-center truncate w-full px-1" title={file.originalname}>
          {file.originalname}
        </span>
        <span className="text-[8px] text-white/60">
          {(file.size / 1024).toFixed(1)} KB
        </span>
      </div>
    </a>
  );
};

export default FileAttachment;
