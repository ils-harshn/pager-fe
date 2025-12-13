const AVATAR_COLORS = [
  "#ef4444", // red
  "#f59e0b", // orange
  "#10b981", // green
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
];

const AVATAR_EMOJIS = [
  "😀", "😎", "🤓", "😇", "🤠", "🥳", "🤖", "👽",
  "🐶", "🐱", "🐼", "🦊", "🐻", "🐨", "🐯", "🦁",
  "🚀", "⚡", "🌟", "🔥", "💎", "🎯", "🎨", "🎭"
];

export const generateAvatar = (username) => {
  const hash = username.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const colorIndex = Math.abs(hash) % AVATAR_COLORS.length;
  const emojiIndex = Math.abs(hash >> 8) % AVATAR_EMOJIS.length;
  
  return {
    color: AVATAR_COLORS[colorIndex],
    emoji: AVATAR_EMOJIS[emojiIndex],
  };
};

export const getInitials = (username) => {
  return username.substring(0, 2).toUpperCase();
};
