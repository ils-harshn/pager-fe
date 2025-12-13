const WaitingForApproval = ({ id }) => {
  return (
    <div className="mx-auto max-w-[1440px] h-[100dvh] border-l border-r border-[#B3B3B3] flex flex-col items-center justify-center gap-2">
      <p className="text-white">
        Waiting for the owner to let you in the room{" "}
        <span className="text-[#1596ff] font-bold">{id}</span>...
      </p>
    </div>
  );
};

export default WaitingForApproval;
