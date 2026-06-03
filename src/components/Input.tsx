import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  isTextArea?: boolean;
  rows?: number;
}

const Input = forwardRef<HTMLInputElement & HTMLTextAreaElement, InputProps>(
  ({ label, error, isTextArea = false, rows = 4, className = '', type = 'text', ...props }, ref) => {
    const inputStyle = `w-full px-4 py-3 rounded-xl border bg-white focus:bg-white text-slate-800 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-600/20 ${
      error
        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
        : 'border-slate-200 focus:border-primary-600'
    } ${className}`;

    return (
      <div className="w-full text-left">
        <label className="block text-xs font-heading font-semibold text-slate-500 uppercase tracking-wider mb-2">
          {label}
        </label>
        {isTextArea ? (
          <textarea
            ref={ref}
            rows={rows}
            className={inputStyle}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref}
            type={type}
            className={inputStyle}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {error && (
          <span className="block text-xs font-medium text-rose-500 mt-1.5 animate-fade-in">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
