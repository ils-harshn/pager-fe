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

const getTimeKey = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
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
      // Check if same minute - if so, add to last time group
      const lastTimeGroup = currentGroup.timeGroups[currentGroup.timeGroups.length - 1];
      if (getTimeKey(lastTimeGroup.at) === getTimeKey(message.at)) {
        lastTimeGroup.messages.push(message);
      } else {
        // Different minute, create new time group
        currentGroup.timeGroups.push({
          at: message.at,
          messages: [message]
        });
      }
    } else {
      currentGroup = {
        id: message.id,
        username: message.username,
        at: message.at,
        avatar: message.avatar,
        timeGroups: [{
          at: message.at,
          messages: [message]
        }]
      };
      groups.push(currentGroup);
    }
  });

  return groups;
};
