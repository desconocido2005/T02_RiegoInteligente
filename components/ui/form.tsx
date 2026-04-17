'use client';

import { forwardRef } from 'react';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ButtonHTMLAttributes } from 'react';

// --- Button ---
export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
  }
>(({ variant = 'primary', size = 'md', loading = false, className = '', children, disabled, ...rest }, ref) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap';
  const variants = {
    primary:
      'bg-primary text-primary-foreground hover:bg-accent active:bg-primary/90',
    secondary:
      'bg-muted text-foreground hover:bg-border border border-border',
    outline:
      'bg-transparent text-foreground border border-border hover:border-border-strong hover:bg-muted',
    ghost:
      'bg-transparent text-foreground hover:bg-muted',
    danger:
      'bg-error text-primary-foreground hover:bg-error/90',
  };
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading && (
        <span
          className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"
          aria-hidden
        />
      )}
      {children}
    </button>
  );
});
Button.displayName = 'Button';

// --- Label ---
export function Label({
  children,
  htmlFor,
  required,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-medium tracking-wide uppercase text-text-muted mb-1.5">
      {children}
      {required && <span className="text-error ml-0.5">*</span>}
    </label>
  );
}

// --- Input ---
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full h-11 px-3.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 ${className}`}
        {...rest}
      />
    );
  },
);
Input.displayName = 'Input';

// --- Textarea ---
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', rows = 3, ...rest }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full px-3.5 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none ${className}`}
        {...rest}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

// --- Select ---
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', children, ...rest }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full h-11 px-3.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 ${className}`}
        {...rest}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = 'Select';

// --- Switch (toggle) ---
export function Switch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  description?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full mt-0.5 ${
          checked ? 'bg-primary' : 'bg-border-strong'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-card shadow transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
      {(label || description) && (
        <div className="flex-1">
          {label && <p className="text-sm font-medium text-foreground">{label}</p>}
          {description && <p className="text-xs text-text-secondary mt-0.5">{description}</p>}
        </div>
      )}
    </label>
  );
}

// --- Field wrapper with error ---
export function Field({
  label,
  htmlFor,
  required,
  error,
  children,
  hint,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-text-muted mt-1.5">{hint}</p>}
      {error && <p className="text-xs text-error mt-1.5">{error}</p>}
    </div>
  );
}
