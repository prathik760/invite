import { forwardRef, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  required?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-foreground/70 mb-1.5">
            {label}
            {required && <span className="text-accent-strong ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent transition-colors ${
            error ? 'border-rose-300' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
