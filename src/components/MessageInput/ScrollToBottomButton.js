import { MdKeyboardArrowDown } from "react-icons/md";

const ScrollToBottomButton = ({ scrollButton, onClick }) => {
  if (!scrollButton.show) return null;

  return (
    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-50">
      <button
        onClick={onClick}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-2xl transition-all duration-200 flex items-center gap-2 hover:scale-105"
      >
        <MdKeyboardArrowDown className="text-2xl" />
        {scrollButton.count > 0 && (
          <span className="text-sm font-semibold pr-1">
            {scrollButton.count} new
          </span>
        )}
      </button>
    </div>
  );
};

export default ScrollToBottomButton;
