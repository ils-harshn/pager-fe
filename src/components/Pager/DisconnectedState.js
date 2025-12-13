const DisconnectedState = () => {
  return (
    <div className="mx-auto max-w-[1440px] h-[100dvh] border-l border-r border-[#B3B3B3] flex flex-col items-center justify-center gap-2">
      <p className="text-white">
        Disconnected. Please refresh the page to reconnect.
      </p>
    </div>
  );
};

export default DisconnectedState;
