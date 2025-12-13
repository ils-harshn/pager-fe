import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "../router/ROUTES";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa6";
import { PageLayout, FormInput, Button } from "../components/common";

const Index = () => {
  const navigate = useNavigate();
  const [inputState, setInputState] = useState({ 
    roomId: "", 
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
    navigate(`${ROUTES.GET_PAGER(inputState.roomId, inputState.username)}?${params}`);
  };

  return (
    <PageLayout>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 border-b border-[#D97F26] border-l border-r">
          <FormInput
            placeholder="Room ID"
            name="roomId"
            value={inputState.roomId}
            onChange={handleInputChange}
            required
            autoFocus
            className="border-r border-[#D97F26]"
          />
          <FormInput
            placeholder="Username"
            name="username"
            value={inputState.username}
            onChange={handleInputChange}
            required
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
            <p className="text-sm">Join a temporary chat room. We'll generate a fun avatar for you!</p>
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
          <p>Support is always welcome. Get in touch</p>
        </div>
        <div className="text-white px-5 pb-3 flex items-center justify-center gap-2">
          <FaGithub className="text-white text-2xl" />
          <FaLinkedin className="text-white text-2xl" />
          <FaFacebook className="text-white text-2xl" />
          <FaDiscord className="text-white text-2xl" />
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
