import { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa6";

const Time = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="px-5 py-2 border-l border-[#B3B3B3] flex items-center">
        <FaClock className="text-xl text-[#f0f0f0da]" />
      </div>
      <div className="px-5 py-2 border-l border-[#B3B3B3] w-[110px]">
        <p className="text-xs text-[#f0f0f0da] text-center">
          {time.toLocaleTimeString([], { hour12: false })}
        </p>
        <p className="text-xs text-[#f0f0f0da] text-center">
          {time.toLocaleDateString()}
        </p>
      </div>
    </>
  );
};

export default Time;
