import Avatar from "./Avatar";

const UserInfo = ({ 
  user, 
  avatarSize = "medium",
  showStatus = true,
  showYou = false,
  className = ""
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar avatar={user.avatar} size={avatarSize} />
      <div>
        <p className="text-white font-semibold">
          {user.username}
          {showYou && " (You)"}
          {user?.owner ? " (Moderator)" : ""}
          {user?.isAdmin ? " (Admin)" : ""}
        </p>
        {showStatus && user.status && (
          <p className="text-gray-300 text-xs italic">{user.status}</p>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
