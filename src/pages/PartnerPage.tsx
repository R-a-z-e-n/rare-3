import { motion } from 'framer-motion'
import { PartnerOnboarding } from '@/components/PartnerOnboarding'
import { PageHeader } from '@/components/ui'

export default function PartnerPage() {
  return (
    <div className="bg-cream min-h-screen pb-32">
      <PageHeader 
        label="The Collective" 
        title={`Join the <em class='text-rose italic'>Rare</em> Network`}
        subtitle="Submit your sanctuary to our curation team and connect with a community of high-performance wellness seekers."
      />

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <PartnerOnboarding />
        </motion.div>
      </div>
    </div>
  )
}
