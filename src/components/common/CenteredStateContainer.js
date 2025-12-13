const CenteredStateContainer = ({ children, className = "" }) => {
  return (
    <div className={`mx-auto max-w-[1440px] h-[100dvh] border-l border-r border-[#B3B3B3] flex flex-col items-center justify-center gap-2 ${className}`}>
      {children}
    </div>
  );
};

export default CenteredStateContainer;
