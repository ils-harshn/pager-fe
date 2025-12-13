import FilePreview from "./FilePreview";

const FileAttachmentsList = ({ selectedFiles, onRemoveFile }) => {
  if (selectedFiles.length === 0) return null;

  return (
    <div className="px-4 pt-2 pb-2 bg-[#3d1a42] border-b border-[#831d8d]">
      <div className="flex gap-1 overflow-x-auto pb-2">
        {selectedFiles.map((fileObj) => (
          <FilePreview 
            key={fileObj.id} 
            fileObj={fileObj} 
            onRemove={onRemoveFile} 
          />
        ))}
      </div>
    </div>
  );
};

export default FileAttachmentsList;
