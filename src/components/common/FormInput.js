const FormInput = ({ 
  type = "text", 
  placeholder, 
  name, 
  value, 
  onChange, 
  required = false,
  autoFocus = false,
  maxLength,
  className = "",
  variant = "primary" // primary or secondary
}) => {
  const baseClasses = "px-5 py-3 outline-none placeholder:text-[#b1b1b1]";
  
  const variantClasses = {
    primary: "bg-[#3A2410] text-lg text-white",
    secondary: "bg-[#3A2410] text-base text-white"
  };

  return (
    <input
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      autoFocus={autoFocus}
      maxLength={maxLength}
    />
  );
};

export default FormInput;
