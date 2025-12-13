import CenteredStateContainer from '../common/CenteredStateContainer';

const WaitingForApproval = ({ id }) => {
  return (
    <CenteredStateContainer>
      <p className="text-white">
        Waiting for the owner to let you in the room{" "}
        <span className="text-[#1596ff] font-bold">{id}</span>...
      </p>
    </CenteredStateContainer>
  );
};

export default WaitingForApproval;
