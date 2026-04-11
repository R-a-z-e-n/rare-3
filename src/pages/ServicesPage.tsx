import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Heart, Search } from 'lucide-react'
import { Tag, StarRating, OptimizedImage, PageHeader, FilterPills, Button, ScrollReveal } from '@/components/ui'
import { BookingModal } from '@/components/booking/BookingModal'
import { useServices } from '@/hooks/useServices'
import type { Service } from '@/types'

const CATEGORIES: string[] = ['All', 'Spa', 'Yoga', 'Meditations', 'Facials']

// Static services moved to mockApi

export default function ServicesPage() {
  const { data: services = [], isLoading, isError } = useServices()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const filteredServices = services.filter(s => {
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="bg-cream min-h-screen pb-32">
      <PageHeader 
        label="Destinations" 
        title="Explore Your <em className='text-rose italic'>Sanctuary</em>"
        subtitle="Discover curated wellness experiences designed to restore balance and inspire transformation across California."
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Search & Filter Bar */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
            <FilterPills 
              options={CATEGORIES} 
              active={activeCategory} 
              onChange={setActiveCategory} 
            />
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
              <input 
                type="text" 
                placeholder="Search by name or location..." 
                className="w-full bg-linen border-none p-4 pl-12 text-sm focus:ring-1 focus:ring-gold outline-none"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Grid */}
        <div className="min-h-[400px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-rose font-playfair italic">Failed to find sanctuaries. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence mode="popLayout">
                {filteredServices.map((service, index) => (
                  <ScrollReveal key={service.id} delay={index * 0.1}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="group bg-linen border border-dark/5 hover:border-gold/20 transition-all duration-500 hover:shadow-2xl"
                    >
                      <div className="relative h-72 overflow-hidden">
                        <OptimizedImage src={service.image} alt={service.name} zoom className="w-full h-full" />
                        <div className="absolute top-4 right-4 z-10">
                          <button className="w-10 h-10 rounded-full bg-cream/90 backdrop-blur-md flex items-center justify-center text-mauve hover:text-rose transition-colors">
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="absolute bottom-4 left-4 flex gap-2">
                          {service.tags.map(tag => <Tag key={tag} label={tag} variant="gold" />)}
                        </div>
                      </div>

                      <div className="p-8">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-playfair text-xl text-dark group-hover:text-rose transition-colors duration-300">{service.name}</h3>
                            <div className="flex flex-col gap-1 mt-2">
                              <p className="text-mauve text-[10px] flex items-center gap-1.5 tracking-wide uppercase">
                                <MapPin className="w-3 h-3 text-gold" /> {service.location}
                              </p>
                              <p className="text-mauve/60 text-[9px] font-light leading-snug pl-4 italic">
                                {service.address}
                              </p>
                            </div>
                          </div>
                          <StarRating rating={service.rating} />
                        </div>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-dark/5">
                          <p className="text-xl font-playfair text-gold">{service.price}<span className="text-[10px] text-mauve/60 uppercase tracking-widest ml-1 font-sans">/ session</span></p>
                          <Button onClick={() => setSelectedService(service)}>Book Now</Button>
                        </div>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <BookingModal 
        isOpen={!!selectedService} 
        onClose={() => setSelectedService(null)} 
        serviceName={selectedService?.name || ''} 
      />
    </div>
  )
}
