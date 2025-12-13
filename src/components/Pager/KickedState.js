const KickedState = () => {
  return (
    <div className="mx-auto max-w-[1440px] h-[100dvh] border-l border-r border-[#B3B3B3] flex flex-col items-center justify-center gap-2">
      <p className="text-white text-xl mb-2">
        You were kicked from the room by the owner.
      </p>
      <a
        href="/"
        className="bg-[#03B0D5] px-5 py-2 text-white rounded-full hover:bg-[#0299bd]"
      >
        Return to Home
      </a>
    </div>
  );
};

export default KickedState;
