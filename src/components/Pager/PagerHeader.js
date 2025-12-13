import { FaPager } from "react-icons/fa6";
import Logout from "./Logout";
import Links from "./Links";
import Time from "./Time";

const PagerHeader = () => {
  return (
    <header className="border-[#B3B3B3] border-b bg-[#2D2D2D] flex justify-between">
      <div className="flex items-center">
        <div className="border-r border-[#B3B3B3] px-5 py-2 flex items-center">
          <FaPager className="text-4xl text-[#FFD43B]" />
        </div>
        <div className="px-5 py-2 flex items-center border-r border-[#B3B3B3]">
          <h3 className="text-3xl text-[#1596ff] font-kosugi">Pager</h3>
        </div>
      </div>
      <div className="flex">
        <Links />
        <Time />
        <Logout />
      </div>
    </header>
  );
};

export default PagerHeader;
