import CenteredStateContainer from '../common/CenteredStateContainer';
import { Button } from '../common';

const UsernameTaken = ({ id, username }) => {
  const handleGoBack = () => {
    window.location.href = "/";
  };

  return (
    <CenteredStateContainer className="gap-4">
      <p className="text-white text-center max-w-md">
        The username{" "}
        <span className="text-[#1596ff] font-bold">{username}</span> is already
        taken in room{" "}
        <span className="text-[#1596ff] font-bold">{id}</span>.
      </p>
      <p className="text-gray-400 text-center max-w-md">
        Please choose a different username to join this room.
      </p>
      <Button
        onClick={handleGoBack}
        variant="secondary"
        className="mt-4 rounded-lg"
      >
        Go Back
      </Button>
    </CenteredStateContainer>
  );
};

export default UsernameTaken;
