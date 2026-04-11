import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader, FilterPills, Button, ScrollReveal } from '@/components/ui'
import { ProductCard } from '@/components/shop/ProductCard'
import { useProducts } from '@/hooks/useProducts'
import type { SortOption } from '@/types'

const CATEGORIES = ['All', 'Skincare', 'Fragrance', 'Wellness', 'Body']

export default function ShopPage() {
  const { data: products = [], isLoading, isError } = useProducts()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('Featured')

  const filteredProducts = products
    .filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      if (sortOption === 'Price: Low') return a.price - b.price
      if (sortOption === 'Price: High') return b.price - a.price
      if (sortOption === 'Rating') return b.rating - a.rating
      return 0
    })

  return (
    <div className="bg-cream min-h-screen pb-32">
      <PageHeader 
        label="The Edit" 
        title="Curated <em class='text-rose italic'>Essentials</em>"
        subtitle="Discover a hand-picked collection of the world's finest skincare, fragrances, and wellness rituals."
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Mishti Integration Banner */}
        <ScrollReveal>
          <div className="bg-dark p-8 md:p-12 mb-20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="max-w-md">
                <p className="text-gold text-[10px] tracking-[5px] uppercase mb-4">Mishti Personalization</p>
                <h3 className="text-cream text-2xl font-jost uppercase tracking-widest mb-4 italic">Tailored to Your Analysis</h3>
                <p className="text-cream/50 text-sm font-light leading-relaxed">
                  Products marked with a match percentage are curated specifically for your skin profile based on your latest Mishti scan.
                </p>
              </div>
              <Link to="/mishti">
                <Button variant="outline-cream" className="whitespace-nowrap">View Analysis →</Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12">
          <FilterPills options={CATEGORIES} active={activeCategory} onChange={setActiveCategory} />
          
          <div className="flex w-full lg:w-auto gap-4">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
              <input 
                type="text" 
                placeholder="Search products or brands..." 
                className="w-full bg-linen border-none p-4 pl-12 text-sm focus:ring-1 focus:ring-gold outline-none"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative group">
              <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold pointer-events-none" />
              <select 
                value={sortOption}
                onChange={e => setSortOption(e.target.value as SortOption)}
                className="bg-linen border-none p-4 pl-12 pr-10 text-[11px] uppercase tracking-widest text-dark focus:ring-1 focus:ring-gold outline-none appearance-none cursor-pointer"
              >
                {['Featured', 'Price: Low', 'Price: High', 'Rating'].map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="min-h-[400px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-rose font-playfair italic">Failed to load the collection. Please try again.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <ScrollReveal key={product.id} delay={index * 0.1}>
                    <ProductCard product={product} />
                  </ScrollReveal>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
