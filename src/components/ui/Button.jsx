import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  loading = false, 
  icon: Icon,
  ...props 
}) => {
  const variants = {
    primary: 'bg-brand text-brand-contrast hover:bg-brand/90 shadow-brand/20',
    secondary: 'bg-black/5 dark:bg-white/5 text-dim hover:bg-black/10 dark:hover:bg-white/10 hover:text-main border border-black/5 dark:border-white/5',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-brand-contrast border border-red-500/20',
    outline: 'bg-transparent border border-black/20 dark:border-white/20 text-main hover:bg-black/5 dark:hover:bg-white/5',
    ghost: 'bg-transparent text-dim hover:text-main hover:bg-black/5 dark:hover:bg-white/5'
  };

  const baseStyles = 'flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : Icon ? (
        <Icon size={18} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
