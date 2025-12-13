import { useEffect, useRef, useState } from "react";

const useMessageScroll = (messagesContainerRef, onScrollButtonChange) => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  const isUserAtBottom = () => {
    if (!messagesContainerRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 50;
  };

  const scrollToBottom = (behavior = "smooth") => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: behavior,
      });
    }
  };

  const handleScroll = () => {
    const atBottom = isUserAtBottom();
    const shouldShow = !atBottom;
    setShowScrollButton(shouldShow);
    if (atBottom) {
      setNewMessagesCount(0);
    }
    if (onScrollButtonChange) {
      onScrollButtonChange({ show: shouldShow, count: atBottom ? 0 : newMessagesCount });
    }
  };

  const handleScrollButtonClick = () => {
    scrollToBottom("smooth");
    setNewMessagesCount(0);
    setShowScrollButton(false);
    if (onScrollButtonChange) {
      onScrollButtonChange({ show: false, count: 0 });
    }
  };

  const incrementNewMessages = () => {
    const newCount = newMessagesCount + 1;
    setNewMessagesCount(newCount);
    setShowScrollButton(true);
    if (onScrollButtonChange) {
      onScrollButtonChange({ show: true, count: newCount });
    }
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      setTimeout(() => scrollToBottom("auto"), 100);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // Expose scrollToBottom to parent
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollToBottomHandler = handleScrollButtonClick;
    }
  }, []);

  return {
    isUserAtBottom,
    scrollToBottom,
    handleScrollButtonClick,
    incrementNewMessages,
    newMessagesCount
  };
};

export default useMessageScroll;
