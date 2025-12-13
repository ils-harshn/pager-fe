import { useEffect } from "react";

/**
 * Custom hook to manage socket event listeners with automatic cleanup
 * @param {Object} socket - Socket instance
 * @param {Array} events - Array of { event: string, handler: function }
 * @param {Array} dependencies - Dependencies array for useEffect
 */
const useSocketEvent = (socket, events, dependencies = []) => {
  useEffect(() => {
    // Subscribe to all events
    events.forEach(({ event, handler }) => {
      socket.on(event, handler);
    });

    // Cleanup function to unsubscribe from all events
    return () => {
      events.forEach(({ event, handler }) => {
        socket.off(event, handler);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

export default useSocketEvent;
