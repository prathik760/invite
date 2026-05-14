import { forwardRef, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, children, className = '', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-accent-strong text-white hover:bg-accent-hover shadow-glow',
      secondary: 'bg-surface text-foreground border border-border hover:border-accent shadow-card',
      ghost: 'text-muted hover:text-foreground hover:bg-background',
    }

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3.5 text-base',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button
