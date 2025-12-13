const SectionHeader = ({ title, bgColor, borderColor }) => {
  return (
    <div 
      className={`border-b px-5 py-2`}
      style={{ 
        backgroundColor: bgColor,
        borderColor: borderColor 
      }}
    >
      <h3 className="text-white font-bold">{title}</h3>
    </div>
  );
};

export default SectionHeader;
