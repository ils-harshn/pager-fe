import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ROUTES from "../router/ROUTES";
import { FaPager } from "react-icons/fa6";

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
    <div className="w-[100vw] h-[100dvh] justify-center items-center grid [grid-template-columns:1fr_auto_1fr] [grid-template-rows:1fr_auto_1fr]">
      <div className="border-[#B3B3B3] border-r border-b w-full h-full"></div>
      <div className="border-[#B3B3B3] border-b w-full h-full"></div>
      <div className="border-[#B3B3B3] border-l border-b w-full h-full"></div>
      <div className="border-[#B3B3B3] border-b w-full h-full"></div>
      <div className="min-w-[300px] max-w-[620px] w-[100vw] border-[#B3B3B3] border-b">
        <div className="border-[#B3B3B3] border-b border-l border-r bg-[#2D2D2D] flex justify-between">
          <div className="px-5 py-2">
            <h3 className="text-5xl text-[#1596ff] font-kosugi">Pager</h3>
          </div>
          <div className="border-l border-[#B3B3B3] px-10 py-2">
            <FaPager className="text-5xl text-[#FFD43B]" />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="border-b border-l border-r border-[#B3B3B3] bg-[#2D2D2D] px-5 py-3">
            <p className="text-white text-lg">
              Join room: <span className="text-[#1596ff] font-bold">{id}</span>
            </p>
          </div>
          <div className="border-b border-[#D97F26] border-l border-r">
            <input
              className="px-5 py-3 bg-[#3A2410] outline-none text-lg text-white placeholder:text-[#b1b1b1] w-full"
              type="text"
              placeholder="Username"
              name="username"
              value={inputState.username}
              onChange={handleInputChange}
              required
              autoFocus
            />
          </div>
          <div className="border-b border-[#D97F26] border-l border-r">
            <input
              className="px-5 py-3 bg-[#3A2410] outline-none text-base text-white placeholder:text-[#b1b1b1] w-full"
              type="text"
              placeholder="Status message (optional) - e.g. 'Ready to chat!'"
              name="status"
              value={inputState.status}
              onChange={handleInputChange}
              maxLength={50}
            />
          </div>
          <div className="flex items-center justify-between border-l border-r border-[#B3B3B3]">
            <div className="text-white px-5 py-3">
              <p className="text-sm">We'll generate a fun avatar for you!</p>
            </div>
            <div className="px-2 py-2">
              <button
                className="bg-[#03B0D5] px-5 py-2 text-white rounded-full text-nowrap hover:bg-[#0299bd]"
                type="submit"
              >
                Join Room
              </button>
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
      </div>
      <div className="border-[#B3B3B3] border-b w-full h-full"></div>
      <div className="border-[#B3B3B3] border-r w-full h-full"></div>
      <div className="border-[#B3B3B3] w-full h-full"></div>
      <div className="border-[#B3B3B3] border-l w-full h-full"></div>
    </div>
  );
};

export default JoinRoom;
