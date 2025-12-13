import { useEffect, useRef } from "react";

const useAutoResizeTextarea = (message, maxHeight = 400) => {
  const textareaRef = useRef(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return { textareaRef, adjustTextareaHeight };
};

export default useAutoResizeTextarea;
