import { motion, type HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'default' | 'outline' | 'outline-cream' | 'gold' | 'ghost'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant
  isLoading?: boolean
  children: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-dark text-cream hover:bg-dark/90',
  outline: 'border border-dark text-dark hover:bg-dark/5',
  'outline-cream': 'border border-cream/40 text-cream hover:bg-cream/10',
  gold: 'bg-gold text-cream hover:bg-gold/90',
  ghost: 'bg-transparent text-dark hover:bg-dark/5',
}

export function Button({
  variant = 'default',
  isLoading,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      disabled={isLoading || props.disabled}
      className={cn(
        'inline-flex items-center justify-center px-8 py-3.5 text-[10px] uppercase tracking-[3px] font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </motion.button>
  )
}
