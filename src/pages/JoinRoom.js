import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ROUTES from "../router/ROUTES";
import { PageLayout, FormInput, Button } from "../components/common";

const JoinRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inputState, setInputState] = useState({ 
    username: "",
    status: "" 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputState({ ...inputState, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      status: inputState.status || ""
    });
    navigate(`${ROUTES.GET_PAGER(id, inputState.username)}?${params}`);
  };

  return (
    <PageLayout>
      <form onSubmit={handleSubmit}>
        <div className="border-b border-l border-r border-[#B3B3B3] bg-[#2D2D2D] px-5 py-3">
          <p className="text-white text-lg">
            Join room: <span className="text-[#1596ff] font-bold">{id}</span>
          </p>
        </div>
        <div className="border-b border-[#D97F26] border-l border-r">
          <FormInput
            placeholder="Username"
            name="username"
            value={inputState.username}
            onChange={handleInputChange}
            required
            autoFocus
            className="w-full"
          />
        </div>
        <div className="border-b border-[#D97F26] border-l border-r">
          <FormInput
            placeholder="Status message (optional) - e.g. 'Ready to chat!'"
            name="status"
            value={inputState.status}
            onChange={handleInputChange}
            maxLength={50}
            variant="secondary"
            className="w-full"
          />
        </div>
        <div className="flex items-center justify-between border-l border-r border-[#B3B3B3]">
          <div className="text-white px-5 py-3">
            <p className="text-sm">We'll generate a fun avatar for you!</p>
          </div>
          <div className="px-2 py-2">
            <Button type="submit">
              Join Room
            </Button>
          </div>
        </div>
      </form>

      <div className="flex items-center justify-between border-l border-r border-t border-[#B3B3B3] h-[52px]"></div>
      <div className="flex items-center justify-between border-l border-r border-[#B3B3B3] h-[52px]"></div>
      <div className="border-l border-r border-t border-[#B3B3B3]">
        <div className="text-white px-5 py-3 text-center">
          <p className="text-sm text-gray-400">
            Enter your details to join the room
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default JoinRoom;