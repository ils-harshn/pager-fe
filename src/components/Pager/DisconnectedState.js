import CenteredStateContainer from '../common/CenteredStateContainer';

const DisconnectedState = () => {
  return (
    <CenteredStateContainer>
      <p className="text-white">
        Disconnected. Please refresh the page to reconnect.
      </p>
    </CenteredStateContainer>
  );
};

export default DisconnectedState;
