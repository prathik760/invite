import { forwardRef, TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  required?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-foreground/70 mb-1.5">
            {label}
            {required && <span className="text-accent ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent/40 transition-colors resize-none ${
            error ? 'border-red-500/50' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'

export default Textarea
