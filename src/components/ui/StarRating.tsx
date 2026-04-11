import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  showNumber?: boolean
  className?: string
}

export function StarRating({ rating, showNumber = true, className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              'w-3 h-3 transition-colors',
              i < Math.floor(rating) ? 'text-gold fill-gold' : 'text-gold/20'
            )}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-[11px] font-medium text-gold/80 pt-0.5">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
