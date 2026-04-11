import { cn } from '@/lib/utils'

interface TagProps {
  label: string
  variant?: 'default' | 'rose' | 'gold'
  className?: string
}

const variantClasses = {
  default: 'bg-linen text-dark/70',
  rose: 'bg-rose/10 text-rose',
  gold: 'bg-gold/10 text-gold',
}

export function Tag({ label, variant = 'default', className }: TagProps) {
  return (
    <span
      className={cn(
        'text-[9px] font-medium uppercase tracking-[2px] px-2.5 py-1 rounded-sm',
        variantClasses[variant],
        className
      )}
    >
      {label}
    </span>
  )
}
