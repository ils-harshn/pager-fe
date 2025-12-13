const RoomEndedState = () => {
  return (
    <div className="flex items-center justify-center h-[100dvh] bg-[#1a1a1a]">
      <div className="text-center px-5 max-w-md">
        <div className="mb-6">
          <h1 className="text-5xl mb-4">🚪</h1>
          <h2 className="text-white text-2xl font-bold mb-3">Room Closed</h2>
          <p className="text-gray-300 text-base">
            This room has been closed because all moderators and admins have left.
          </p>
        </div>
        <div className="mt-8">
          <a
            href="/"
            className="inline-block bg-[#03d506] px-6 py-2 text-white rounded-full font-bold hover:bg-[#02a805] transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default RoomEndedState;
