import CenteredStateContainer from '../common/CenteredStateContainer';

const KickedState = () => {
  return (
    <CenteredStateContainer>
      <p className="text-white text-xl mb-2">
        You were kicked from the room by the owner.
      </p>
      <a
        href="/"
        className="bg-[#03B0D5] px-5 py-2 text-white rounded-full hover:bg-[#0299bd]"
      >
        Return to Home
      </a>
    </CenteredStateContainer>
  );
};

export default KickedState;
