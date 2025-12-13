const Button = ({ 
  children, 
  onClick, 
  type = "button",
  variant = "primary", // primary, success, danger, warning, info
  size = "medium", // small, medium, large
  className = "",
  icon,
  ...props
}) => {
  const baseClasses = "text-white rounded-full text-nowrap font-bold transition-colors flex items-center gap-1";
  
  const variantClasses = {
    primary: "bg-[#03B0D5] hover:bg-[#0299bd]",
    success: "bg-[#03d506] hover:bg-[#02a805]",
    danger: "bg-[#d53703] hover:bg-[#b32f02]",
    warning: "bg-[#f59e0b] hover:bg-[#fbbf24]",
    info: "bg-[#2563eb] hover:bg-[#3b82f6]",
    secondary: "bg-[#1596ff] hover:bg-[#0d7de0]"
  };

  const sizeClasses = {
    small: "px-3 py-1 text-sm",
    medium: "px-5 py-2 text-base",
    large: "px-6 py-2 text-lg"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      type={type}
      {...props}
    >
      {icon && icon}
      {children}
    </button>
  );
};

export default Button;
