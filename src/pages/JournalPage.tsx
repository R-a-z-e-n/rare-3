import { motion } from 'framer-motion'
import { ArrowRight, Clock } from 'lucide-react'
import { Tag, OptimizedImage, PageHeader, Button, SectionLabel } from '@/components/ui'
import type { Article } from '@/types'

const FEATURED = {
  id: 0,
  title: 'The Art of Slow Skincare: A Ritual for the Soul',
  category: 'Rituals',
  excerpt: 'In a world that rushes, your skincare routine can become a sanctuary. Discover how mindful application transforms simple products into profound rituals of self-love and presence.',
  image: 'https://images.unsplash.com/photo-1722350766824-f8520e9676ac?w=1200&q=80',
  readTime: '8 min read',
  author: 'Elena R.'
}

const ARTICLES: Article[] = [
  { id: 1, title: 'Molecular Hydration: The Science of Glow', category: 'Science', excerpt: 'Beyond the surface. We dive deep into the molecular structures that keep your skin plump and radiant throughout the seasons.', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80', readTime: '5 min read' },
  { id: 2, title: 'Morning Intentions: 5 Rituals for Clarity', category: 'Mindfulness', excerpt: 'Start your day with purpose. These five simple practices will ground your energy before stepping into the world.', image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80', readTime: '4 min read' },
  { id: 3, title: 'Sourcing with Integrity: Our Global Harvest', category: 'Community', excerpt: 'From the peaks of the Atlas Mountains to the coastal fields of Provence, meet the farmers behind our potent botanicals.', image: 'https://images.unsplash.com/photo-1643379850623-7eb6442cd262?w=800&q=80', readTime: '7 min read' },
  { id: 4, title: 'The Architecture of the Facial Sanctuary', category: 'Lifestyle', excerpt: 'How to curate your personal spa environment. Lighting, scent, and texture come together for the ultimate retreat.', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80', readTime: '6 min read' },
  { id: 5, title: 'Botanical Alchemy: Mixing Your Own Elixirs', category: 'Rituals', excerpt: 'Unlock the potential of your oils. A masterclass in layering and blending for your specific environmental needs.', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', readTime: '5 min read' },
  { id: 6, title: 'The Silence of Sanctuaries: A Photo Series', category: 'Visuals', excerpt: 'A visual journey through the most tranquil wellness destinations across the California coastline.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', readTime: '3 min read' },
]

export default function JournalPage() {
  return (
    <div className="bg-cream min-h-screen pb-32">
      <PageHeader 
        label="The Journal" 
        title="Stories of <em class='text-rose italic'>Presence</em>"
        subtitle="Explore our curated collection of insights into the science of beauty, the art of ritual, and the community of RARE."
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Featured Article */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative lg:h-[600px] flex flex-col lg:flex-row mb-32 group"
        >
          <div className="lg:w-2/3 h-96 lg:h-full overflow-hidden">
            <OptimizedImage 
              src={FEATURED.image} 
              alt={FEATURED.title} 
              zoom 
              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000" 
            />
          </div>
          <div className="lg:w-1/2 lg:absolute right-0 bottom-0 bg-dark p-10 lg:p-16 lg:translate-y-12 shadow-2xl z-10">
            <div className="mb-8">
              <Tag label={FEATURED.category} variant="gold" className="mb-6" />
              <h2 className="font-playfair text-3xl md:text-5xl text-cream mb-6 leading-tight group-hover:italic transition-all duration-500">
                {FEATURED.title}
              </h2>
              <p className="text-cream/60 text-sm font-light leading-relaxed mb-8 max-w-md">
                {FEATURED.excerpt}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-cream/10 pt-8">
              <div className="flex items-center gap-4 text-cream/40 text-[10px] uppercase tracking-widest">
                <span>By {FEATURED.author}</span>
                <span className="w-1 h-1 rounded-full bg-gold" />
                <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> {FEATURED.readTime}</span>
              </div>
              <button className="text-gold hover:text-rose transition-colors flex items-center gap-2 group/btn">
                Read Story <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
          {ARTICLES.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden mb-8 bg-linen">
                <OptimizedImage 
                  src={article.image} 
                  alt={article.title} 
                  zoom 
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" 
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Tag label={article.category} className="text-gold" />
                  <span className="text-[10px] text-mauve/60 uppercase tracking-widest flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {article.readTime}
                  </span>
                </div>
                <h3 className="font-playfair text-2xl text-dark leading-tight group-hover:text-rose transition-colors duration-300">
                  {article.title}
                </h3>
                <p className="text-mauve text-sm font-light leading-relaxed line-clamp-2 italic">
                  "{article.excerpt}"
                </p>
                <div className="pt-4 overflow-hidden">
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-[3px] text-gold"
                  >
                    Continue Reading <ArrowRight className="w-3 h-3" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 p-16 bg-linen border border-dark/5 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-rose/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10 max-w-xl mx-auto">
            <SectionLabel text="The Ritual List" />
            <h2 className="font-playfair text-3xl text-dark mb-6 mt-4 italic">Join Our Community</h2>
            <p className="text-mauve text-sm font-light mb-10 leading-relaxed">
              Receive curated wellness insights, early access to new collections, and stories from our sanctuaries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="flex-1 bg-cream border-none p-4 text-sm focus:ring-1 focus:ring-gold outline-none"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
