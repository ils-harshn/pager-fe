const UsernameTaken = ({ id, username }) => {
  const handleGoBack = () => {
    window.location.href = "/";
  };

  return (
    <div className="mx-auto max-w-[1440px] h-[100dvh] border-l border-r border-[#B3B3B3] flex flex-col items-center justify-center gap-4">
      <p className="text-white text-center max-w-md">
        The username{" "}
        <span className="text-[#1596ff] font-bold">{username}</span> is already
        taken in room{" "}
        <span className="text-[#1596ff] font-bold">{id}</span>.
      </p>
      <p className="text-gray-400 text-center max-w-md">
        Please choose a different username to join this room.
      </p>
      <button
        onClick={handleGoBack}
        className="mt-4 px-6 py-2 bg-[#1596ff] text-white rounded-lg hover:bg-[#0d7de0] transition-colors"
      >
        Go Back
      </button>
    </div>
  );
};

export default UsernameTaken;
