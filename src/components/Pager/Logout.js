import { useNavigate } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa6";
import socket from "../../socket";
import ROUTES from "../../router/ROUTES";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    socket.disconnect();
    navigate(ROUTES.INDEX);
  };

  return (
    <button
      onClick={handleLogout}
      className="px-5 py-2 border-l border-[#B3B3B3] flex items-center text-[#f0f0f0da] hover:text-white"
    >
      <FaPowerOff className="text-xl" />
    </button>
  );
};

export default Logout;
