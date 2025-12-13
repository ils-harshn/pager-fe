export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const dateStr = date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
  return { time, dateStr };
};

export const groupMessages = (messages) => {
  const groups = [];
  let currentGroup = null;

  messages.forEach((message) => {
    const shouldGroup =
      currentGroup &&
      currentGroup.username === message.username &&
      new Date(message.at).getTime() - new Date(currentGroup.at).getTime() <
        1 * 60 * 1000;
    if (shouldGroup) {
      currentGroup.messages.push(message);
    } else {
      currentGroup = {
        id: message.id,
        username: message.username,
        at: message.at,
        avatar: message.avatar,
        messages: [message],
      };
      groups.push(currentGroup);
    }
  });

  return groups;
};
