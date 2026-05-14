interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'success' | 'warning'
  className?: string
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-border text-muted',
    accent: 'bg-accent/20 text-accent-strong border border-accent/40',
    success: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-600 border border-amber-200',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
