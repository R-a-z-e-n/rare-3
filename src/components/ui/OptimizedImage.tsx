import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  zoom?: boolean
}

export function OptimizedImage({ src, alt, className, zoom = false }: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className={cn('relative overflow-hidden bg-linen/50 group', className)}>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            exit={{ opacity: 0 }}
            className="absolute inset-0 animate-pulse bg-linen"
          />
        )}
      </AnimatePresence>
      
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          'w-full h-full object-cover transition-transform duration-700 ease-in-out',
          zoom && 'group-hover:scale-110'
        )}
      />
    </div>
  )
}
