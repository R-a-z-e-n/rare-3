import { cn } from '@/lib/utils'

interface SectionLabelProps {
  text: string
  light?: boolean
}

export function SectionLabel({ text, light = false }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className={cn('w-4 h-[1px]', light ? 'bg-cream/30' : 'bg-gold/30')} />
      <span
        className={cn(
          'text-[9px] tracking-[5px] uppercase font-medium',
          light ? 'text-cream/80' : 'text-gold'
        )}
      >
        {text}
      </span>
    </div>
  )
}
