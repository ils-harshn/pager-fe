const LoadingState = ({ id, username }) => {
  return (
    <div className="mx-auto max-w-[1440px] h-[100dvh] border-l border-r border-[#B3B3B3] flex flex-col items-center justify-center gap-2">
      <p className="text-white">
        Connecting to room{" "}
        <span className="text-[#1596ff] font-bold">{id}</span> as{" "}
        <span className="text-[#FFD43B] font-bold">{username}</span>...
      </p>
    </div>
  );
};

export default LoadingState;
