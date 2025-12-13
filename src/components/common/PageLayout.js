import { FaPager } from "react-icons/fa6";

const PageLayout = ({ children }) => {
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
        {children}
      </div>
      <div className="border-[#B3B3B3] border-b w-full h-full"></div>
      <div className="border-[#B3B3B3] border-r w-full h-full"></div>
      <div className="border-[#B3B3B3] w-full h-full"></div>
      <div className="border-[#B3B3B3] border-l w-full h-full"></div>
    </div>
  );
};

export default PageLayout;
