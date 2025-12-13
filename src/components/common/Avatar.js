const Avatar = ({ avatar, size = "medium" }) => {
  const sizeClasses = {
    small: "w-8 h-8 text-lg",
    medium: "w-10 h-10 text-xl",
    large: "w-12 h-12 text-2xl"
  };

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center`}
      style={{ backgroundColor: avatar?.color }}
    >
      {avatar?.emoji}
    </div>
  );
};

export default Avatar;
