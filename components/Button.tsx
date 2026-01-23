import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "font-mono uppercase tracking-widest transition-all duration-200 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed border";
  
  const variants = {
    primary: "bg-trade-text text-white border-trade-text hover:bg-trade-accent hover:border-trade-accent",
    secondary: "bg-trade-card text-trade-text border-trade-border hover:border-trade-muted",
    outline: "bg-transparent text-trade-text border-trade-border hover:border-trade-text"
  };

  const sizes = {
    sm: "text-[9px] px-3 py-1.5",
    md: "text-[10px] px-5 py-2.5",
    lg: "text-xs px-8 py-3.5"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
           <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          PROCESSING
        </span>
      ) : children}
    </button>
  );
};