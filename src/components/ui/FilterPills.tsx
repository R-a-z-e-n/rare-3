import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FilterPillsProps {
  options: string[]
  active: string
  onChange: (option: string) => void
}

export function FilterPills({ options, active, onChange }: FilterPillsProps) {
  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={cn(
            'relative px-6 py-2 text-[10px] uppercase tracking-[2px] font-medium transition-colors duration-300 whitespace-nowrap rounded-full',
            active === option ? 'text-cream' : 'text-dark/60 hover:text-dark bg-linen'
          )}
        >
          {active === option && (
            <motion.div
              layoutId="filterPill"
              className="absolute inset-0 bg-rose rounded-full -z-10"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          {option}
        </button>
      ))}
    </div>
  )
}
