import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "../router/ROUTES";

const Index = () => {
  const navigate = useNavigate();
  const [inputState, setInputState] = useState({ roomId: "", userName: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputState({ ...inputState, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(ROUTES.GET_PAGER(inputState.roomId, inputState.userName));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Room ID"
        name="roomId"
        value={inputState.roomId}
        onChange={handleInputChange}
        autoFocus
      />
      <input
        type="text"
        placeholder="Username"
        name="userName"
        value={inputState.userName}
        onChange={handleInputChange}
      />
      <button type="submit">Join Room</button>
    </form>
  );
};

export default Index;
