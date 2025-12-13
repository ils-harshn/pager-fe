import CenteredStateContainer from '../common/CenteredStateContainer';

const LoadingState = ({ id, username }) => {
  return (
    <CenteredStateContainer>
      <p className="text-white">
        Connecting to room{" "}
        <span className="text-[#1596ff] font-bold">{id}</span> as{" "}
        <span className="text-[#FFD43B] font-bold">{username}</span>...
      </p>
    </CenteredStateContainer>
  );
};

export default LoadingState;
