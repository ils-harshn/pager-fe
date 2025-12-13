import { useState, useEffect } from "react";
import Modal from "react-modal";
import { MdClose, MdDownload } from "react-icons/md";

Modal.setAppElement('#root');

const FilePreviewModal = ({ isOpen, onClose, file, fileUrl }) => {
  const [fileType, setFileType] = useState('unknown');
  const [textContent, setTextContent] = useState('');
  const [loadingText, setLoadingText] = useState(false);

  useEffect(() => {
    if (!file) return;
    
    const fileName = file.originalname.toLowerCase();
    const extension = fileName.split('.').pop();
    const mimeType = file.mimetype || '';

    if (mimeType.startsWith('image/')) {
      setFileType('image');
    } else if (extension === 'pdf' || mimeType === 'application/pdf') {
      setFileType('pdf');
    } else if (mimeType.startsWith('video/') || ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'].includes(extension)) {
      setFileType('video');
    } else if (mimeType.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'].includes(extension)) {
      setFileType('audio');
    } else if (
      mimeType.startsWith('text/') || 
      ['txt', 'md', 'json', 'xml', 'yml', 'yaml', 'log', 'js', 'jsx', 'ts', 'tsx', 
       'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 
       'html', 'css', 'scss', 'sass', 'sql', 'sh', 'bash', 'env', 'gitignore',
       'csv', 'ini', 'conf', 'config'].includes(extension)
    ) {
      setFileType('text');
    } else {
      setFileType('download');
    }
  }, [file]);

  useEffect(() => {
    if (fileType === 'text' && isOpen) {
      setLoadingText(true);
      fetch(fileUrl)
        .then(response => response.text())
        .then(text => {
          setTextContent(text);
          setLoadingText(false);
        })
        .catch(error => {
          console.error('Error loading text file:', error);
          setTextContent('Error loading file content');
          setLoadingText(false);
        });
    }
  }, [fileType, fileUrl, isOpen]);

  if (!file) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = file.originalname;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderPreview = () => {
    switch (fileType) {
      case 'image':
        return (
          <div className="flex items-center justify-center max-h-[68vh] overflow-auto">
            <img 
              src={fileUrl} 
              alt={file.originalname}
              className="max-w-full max-h-[68vh] object-contain rounded-lg"
            />
          </div>
        );
      
      case 'pdf':
        return (
          <div className="h-[68vh]">
            <iframe
              src={fileUrl}
              title={file.originalname}
              className="w-full h-full rounded-lg"
            />
          </div>
        );
      
      case 'video':
        return (
          <div className="flex items-center justify-center">
            <video 
              controls 
              className="max-w-full max-h-[68vh] rounded-lg"
              src={fileUrl}
            >
              Your browser does not support video playback.
            </video>
          </div>
        );
      
      case 'audio':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-6 text-white text-lg font-semibold">
              {file.originalname}
            </div>
            <audio 
              controls 
              className="w-full max-w-md"
              src={fileUrl}
            >
              Your browser does not support audio playback.
            </audio>
          </div>
        );
      
      case 'text':
        return (
          <div className="w-full h-[68vh]">
            {loadingText ? (
              <div className="flex items-center justify-center h-full text-white">
                Loading...
              </div>
            ) : (
              <div className="w-full h-full bg-[#1a0a1d] rounded-lg border border-[#831d8d] overflow-hidden">
                <pre className="w-full h-full overflow-auto p-4 text-sm text-gray-200 font-mono whitespace-pre-wrap break-words">
                  {textContent}
                </pre>
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col items-center justify-center py-12 text-white">
            <div className="text-6xl mb-4">📄</div>
            <div className="text-lg font-semibold mb-2">{file.originalname}</div>
            <div className="text-sm text-white/60 mb-6">
              {(file.size / 1024).toFixed(1)} KB
            </div>
            <p className="text-white/70">Preview not available for this file type</p>
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          position: 'relative',
          inset: 'auto',
          border: 'none',
          background: '#2c0e2f',
          borderRadius: '12px',
          padding: '0',
          minWidth: '280px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'hidden',
          border: '2px solid #831d8d',
        }
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-[#831d8d] bg-[#3d1a42]">
          <h2 className="text-white font-semibold text-lg truncate flex-1 min-w-0">
            {file.originalname}
          </h2>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              <MdDownload className="text-xl" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-all text-white"
            >
              <MdClose className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-6">
          {renderPreview()}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#831d8d] bg-[#3d1a42] text-white/60 text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="whitespace-nowrap">Size: {(file.size / 1024).toFixed(1)} KB</span>
            {file.mimetype && (
              <>
                <span className="text-white/30">•</span>
                <span className="break-all">Type: {file.mimetype}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FilePreviewModal;
