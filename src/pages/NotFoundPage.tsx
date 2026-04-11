import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-cream px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md space-y-8"
      >
        <span className="font-playfair text-9xl text-dark/10 block">404</span>
        <div className="space-y-4">
          <h1 className="font-playfair text-4xl text-dark">Lost in the Mists</h1>
          <p className="text-mauve text-sm font-light">The sanctuary path you seek does not exist. Return to the source.</p>
        </div>
        <Link to="/">
          <Button variant="default" className="px-12 h-14 text-xs tracking-widest uppercase">
            Return Home
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
