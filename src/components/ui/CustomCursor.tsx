import { useState, useEffect } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth cursor motion
  const springConfig = { damping: 25, stiffness: 250 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16)
      mouseY.set(e.clientY - 16)
    }

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isSelectable = target.closest('button, a, input, [role="button"]')
      setIsHovering(!!isSelectable)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    window.addEventListener('mousemove', moveMouse)
    window.addEventListener('mouseover', handleHover)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', moveMouse)
      window.removeEventListener('mouseover', handleHover)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [mouseX, mouseY])

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none z-[9999]">
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center p-1"
        style={{ x: cursorX, y: cursorY }}
      >
        <motion.div 
          animate={{ 
            scale: isHovering ? 2.5 : isClicking ? 0.8 : 1,
            backgroundColor: isHovering ? 'rgba(212, 175, 55, 0.1)' : 'rgba(212, 175, 55, 0)'
          }}
          className="w-full h-full rounded-full bg-gold/10"
        />
        <motion.div 
          animate={{ scale: isHovering ? 0 : 1 }}
          className="absolute w-1 h-1 bg-gold rounded-full" 
        />
      </motion.div>
    </div>
  )
}
