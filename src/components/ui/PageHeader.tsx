import { motion } from 'framer-motion'
import { SectionLabel } from './SectionLabel'

interface PageHeaderProps {
  label: string
  title: string
  subtitle?: string
}

export function PageHeader({ label, title, subtitle }: PageHeaderProps) {
  return (
    <div className="py-20 md:py-32 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionLabel text={label} />
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl md:text-6xl font-playfair font-light max-w-2xl leading-tight"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-mauve text-sm md:text-base max-w-lg font-light leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
      
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        className="mt-12 h-[1px] w-24 bg-gold/30"
      />
    </div>
  )
}
