import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button, SectionLabel, StarRating, OptimizedImage, ScrollReveal } from '@/components/ui'
import { useServices } from '@/hooks/useServices'
import { useProducts } from '@/hooks/useProducts'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Testimonial } from '@/types'

const TESTIMONIALS: Testimonial[] = [
  { text: 'RARE transformed my approach to self-care. The Amalfi retreat was pure magic.', author: 'Sophia Chen', service: 'Amalfi Coast Retreat' },
  { text: 'Every product is thoughtfully curated. My skin has never looked better.', author: 'Isabella Martinez', service: 'Skincare Collection' },
  { text: 'The attention to detail and personalized service exceeded expectations.', author: 'Emma Thompson', service: 'Bali Mindfulness' },
]

const INSTA_POSTS = [
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80',
  'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&q=80',
  'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80',
]

const MARQUEE_WORDS = ['Holistic Wellness', 'Curated Experiences', 'Premium Skincare', 'Mindful Living', 'Luxury Retreats', 'Self-Care Rituals']

export default function HomePage() {
  const navigate = useNavigate()
  const { data: services = [], isLoading: isLoadingServices } = useServices()
  const { data: products = [], isLoading: isLoadingProducts } = useProducts()

  const destinations = services.slice(0, 4)
  const featuredProducts = products.filter(p => p.category === 'Skincare').slice(0, 4)
  const aromaProducts = products.filter(p => p.category === 'Fragrance').slice(0, 6)

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps'
  })

  return (
    <div className="bg-cream overflow-hidden">
      {/* ── Hero Split ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 h-screen relative">
        {[
          { label: 'The Sanctuary', title: ['Book an ', 'Experience'], desc: 'Discover world-class spas and wellness sanctuaries curated for you.', cta: 'Find a Sanctuary', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1400&q=80', to: '/services', delay: 0 },
          { label: 'The Edit', title: ['Shop ', 'Luxury'], desc: 'Premium skincare and wellness essentials, handpicked for transformation.', cta: 'Shop the Collection', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1400&q=80', to: '/shop', delay: 0.2 },
        ].map((h) => (
          <motion.div
            key={h.to}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: h.delay }}
            className="relative h-full overflow-hidden group"
          >
            <OptimizedImage src={h.img} alt={h.label} zoom className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent" />
            <div className="absolute bottom-12 lg:bottom-20 left-8 lg:left-16 right-8">
              <SectionLabel text={h.label} light />
              <h1 className="text-cream text-4xl lg:text-6xl font-playfair font-light mb-4 leading-tight">
                {h.title[0]}<br /><em className="text-rose italic ">{h.title[1]}</em>
              </h1>
              <p className="text-cream/50 text-sm max-w-xs mb-8 leading-relaxed font-light">{h.desc}</p>
              <Button variant="outline-cream" onClick={() => navigate(h.to)}>
                {h.cta} <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
        <motion.div 
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.5, delay: 1 }}
          className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent z-10 hidden md:block" 
        />
      </section>

      {/* ── Marquee ── */}
      <div className="bg-linen py-6 border-y border-gold/10 overflow-hidden">
        <div className="marquee-track">
          {[...Array(4)].flatMap((_, i) =>
            MARQUEE_WORDS.map((w, j) => (
              <div key={`${i}-${j}`} className="flex items-center px-10">
                <span className="w-1 h-1 rounded-full bg-gold mr-8 opacity-40" />
                <span className="font-playfair italic text-[16px] text-mauve tracking-widest uppercase">{w}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Destinations ── */}
      <section className="bg-dark py-32 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex justify-between items-end mb-16">
              <div>
                <SectionLabel text="Sanctuaries" light />
                <h2 className="text-cream text-4xl font-playfair font-light">
                  Wellness <em className="text-rose italic">Destinations</em>
                </h2>
              </div>
              <Link to="/services" className="text-gold/60 text-[10px] tracking-widest uppercase hover:text-gold transition-colors pb-2">
                View All Destinations →
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]">
            {isLoadingServices ? (
              <div className="col-span-full flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
              </div>
            ) : (
              destinations.map((d) => (
                <ScrollReveal key={d.id}>
                  <div onClick={() => navigate('/services')} className="cursor-pointer group">
                    <div className="relative overflow-hidden aspect-[4/5] mb-6 shadow-2xl">
                      <OptimizedImage src={d.image} alt={d.name} zoom className="w-full h-full" />
                      <div className="absolute top-4 right-4 bg-dark/60 backdrop-blur-md px-3 py-1.5 rounded-full">
                        <StarRating rating={d.rating} />
                      </div>
                    </div>
                    <h3 className="text-cream text-lg font-playfair mb-1 group-hover:text-gold transition-colors">{d.name}</h3>
                    <p className="text-cream/40 text-[10px] tracking-widest uppercase flex items-center gap-2">📍 {d.location}</p>
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Editorial ── */}
      <section className="bg-dark py-40 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <div className="w-[800px] h-[800px] rounded-full border border-gold" />
          <div className="absolute w-[600px] h-[600px] rounded-full border border-rose" />
        </div>
        <div className="relative z-10 max-w-xl mx-auto">
          <ScrollReveal direction="up" distance={100}>
            <SectionLabel text="The Journal" light />
            <h2 className="text-cream text-6xl md:text-8xl font-playfair font-light mb-8 leading-[1.1]">
              Calm <br /><em className="text-rose italic">Luxury</em>
            </h2>
            <p className="text-cream/50 text-sm mb-12 font-light leading-relaxed max-w-sm mx-auto">
              Curated stories for those who seek authentic transformation through the art of self-care.
            </p>
            <Button variant="outline-cream" onClick={() => navigate('/journal')}>Explore the Journal</Button>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Aroma Section ── */}
      <section className="bg-linen py-32 px-6 lg:px-20 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-2/5 order-2 lg:order-1">
            <ScrollReveal direction="left">
              <SectionLabel text="Sensory Experience" />
              <h2 className="text-dark text-5xl font-playfair font-light mb-8 leading-tight">
                The Aroma <br /><em className="text-rose italic">Collection</em>
              </h2>
              <p className="text-mauve text-sm mb-10 leading-relaxed font-light">
                Elevate your sanctuary with our curated selection of botanical scents. 
                Each fragrance is hand-picked to create a multisensory experience of calmness.
              </p>
              <Button variant="default" onClick={() => navigate('/shop?category=Fragrance')}>
                Explore Fragrances <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </ScrollReveal>
          </div>
          <div className="lg:w-3/5 relative min-h-[400px] order-1 lg:order-2">
            <div className="flex justify-end gap-2 mb-6 lg:absolute lg:-top-16 lg:right-0 z-10">
              <button 
                onClick={() => emblaApi?.scrollPrev()}
                className="w-8 h-8 rounded-full border border-dark/10 flex items-center justify-center hover:bg-dark hover:text-cream transition-all"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <button 
                onClick={() => emblaApi?.scrollNext()}
                className="w-8 h-8 rounded-full border border-dark/10 flex items-center justify-center hover:bg-dark hover:text-cream transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6">
                {isLoadingProducts ? (
                  <div className="flex-[0_0_100%] flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                  </div>
                ) : (
                  aromaProducts.map((p) => (
                    <div key={p.id} className="flex-[0_0_80%] sm:flex-[0_0_45%] min-w-0">
                      <motion.div 
                        whileHover={{ y: -10 }}
                        onClick={() => navigate(`/shop?id=${p.id}`)}
                        className="relative aspect-[3/4] overflow-hidden shadow-xl cursor-pointer"
                      >
                        <OptimizedImage src={p.image} alt={p.name} zoom className="w-full h-full" />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent flex flex-col justify-end p-6">
                          <p className="text-cream/60 text-[10px] tracking-widest uppercase mb-1">{p.brand}</p>
                          <p className="text-cream font-playfair italic text-lg leading-tight">{p.name}</p>
                          <p className="text-gold text-xs mt-2">₹{p.price}</p>
                        </div>
                      </motion.div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section className="bg-cream py-32 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex justify-between items-end mb-16">
              <div>
                <SectionLabel text="The Edit" />
                <h2 className="text-dark text-4xl font-playfair font-light">
                  Premium <em className="text-rose italic">Essentials</em>
                </h2>
              </div>
              <Link to="/shop" className="text-mauve text-[10px] tracking-widest uppercase hover:text-rose transition-colors pb-2">
                Shop the Collection →
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]">
            {isLoadingProducts ? (
              <div className="col-span-full flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
              </div>
            ) : (
              featuredProducts.map((p) => (
                <ScrollReveal key={p.id}>
                  <div onClick={() => navigate(`/shop?id=${p.id}`)} className="group cursor-pointer">
                    <div className="relative overflow-hidden aspect-[3/4] mb-6 shadow-sm">
                      <OptimizedImage src={p.image} alt={p.name} zoom className="w-full h-full" />
                    </div>
                    <p className="text-gold text-[9px] tracking-widest uppercase mb-1">{p.brand}</p>
                    <h3 className="text-dark text-lg font-playfair mb-1 group-hover:text-rose transition-colors">{p.name}</h3>
                    <p className="text-mauve font-light">₹{p.price}</p>
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── About Philosophy ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
        <ScrollReveal direction="left" distance={100} width="100%">
          <OptimizedImage src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200" alt="RARE" className="h-full w-full object-cover" />
        </ScrollReveal>
        <div className="bg-linen p-12 lg:p-24 flex flex-col justify-center">
          <ScrollReveal direction="right" distance={100}>
            <SectionLabel text="Our Philosophy" />
            <h2 className="text-dark text-5xl font-playfair font-light mb-8 leading-tight">
              <em className="text-rose italic">Relaxed</em> & Renew
            </h2>
            <p className="text-mauve text-sm leading-relaxed mb-8 font-light max-w-md">
              RARE is a curated sanctuary for those who seek authentic transformation. 
              We believe in the power of calm luxury, where every experience is designed to restore and inspire.
            </p>
            <div className="border-l-2 border-gold/40 pl-6 mb-12">
              <p className="font-playfair italic text-xl text-rose leading-relaxed">
                "True wellness begins when we create space for ourselves to simply be."
              </p>
            </div>
            <div className="flex gap-12 pt-12 border-t border-dark/5">
              <div>
                <p className="text-3xl font-playfair text-dark">50+</p>
                <p className="text-muted text-[10px] tracking-widest uppercase mt-1">Destinations</p>
              </div>
              <div>
                <p className="text-3xl font-playfair text-dark">96%</p>
                <p className="text-muted text-[10px] tracking-widest uppercase mt-1">Satisfaction</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-dark py-32 px-6 lg:px-20 text-center">
        <ScrollReveal>
          <SectionLabel text="The Experience" light />
          <h2 className="text-cream text-4xl font-playfair font-light mb-20 italic">Global Reflections</h2>
        </ScrollReveal>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={i} direction="up">
              <motion.div whileHover={{ y: -5 }} className="bg-white/5 border border-gold/10 p-10 text-left transition-all hover:bg-white/[0.08]">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => <span key={j} className="text-gold text-xs">★</span>)}
                </div>
                <p className="text-cream/70 font-playfair italic text-lg leading-relaxed mb-8">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-[1px] bg-gold/50" />
                  <p className="text-gold text-[10px] tracking-widest uppercase">{t.author}</p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Membership ── */}
      <section className="bg-dark py-32 px-6 lg:px-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-rose/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-20">
              <SectionLabel text="The Community" light />
              <h2 className="text-cream text-4xl font-playfair font-light">The RARE <em className="text-rose italic">Membership</em></h2>
              <p className="text-cream/40 text-sm mt-4 font-light max-w-lg mx-auto italic">Join a global lineage of individuals who prioritize intentional living and holistic wellness.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { tier: 'Classic', price: 'Free', features: ['Early access to edits', 'Points on every purchase', 'Digital journal access', 'Community events'], accent: 'rose' },
              { tier: 'VIP', price: '₹4,999/mo', features: ['Priority sanctuary booking', '24/7 Skin concierge', 'Quarterly discovery box', '15% off all products'], accent: 'gold', featured: true },
              { tier: 'Elite', price: '₹14,999/mo', features: ['Complimentary retreat transfer', 'Daily custom skin ritual', 'Private sanctuary sessions', 'Lifetime legacy status'], accent: 'rose' },
            ].map((m, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className={cn(
                  "relative p-10 border transition-all duration-500 flex flex-col h-full group",
                  m.featured 
                    ? "bg-linen/5 border-gold shadow-[0_20px_50px_-15px_rgba(212,175,122,0.15)] scale-105 z-10" 
                    : "bg-white/[0.02] border-white/10 hover:border-gold/30"
                )}>
                  {m.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-dark text-[9px] uppercase tracking-[3px] px-6 py-1.5 font-bold">Recommended</div>
                  )}
                  <div className="mb-8">
                    <p className={cn("text-[10px] uppercase tracking-[4px] font-bold mb-2", m.accent === 'gold' ? 'text-gold' : 'text-rose')}>{m.tier}</p>
                    <h3 className="text-cream text-3xl font-playfair">{m.price}</h3>
                  </div>
                  <ul className="space-y-6 mb-12 flex-1">
                    {m.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-4 text-cream/60 text-[11px] uppercase tracking-widest font-light">
                        <span className="w-1 h-1 rounded-full bg-gold mt-1.5 opacity-40" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={m.featured ? 'default' : 'outline-cream'} 
                    className="w-full text-[10px] tracking-[4px]"
                    onClick={() => navigate('/signup')}
                  >
                    Select {m.tier}
                  </Button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instagram ── */}
      <section className="bg-cream py-32">
        <div className="max-w-7xl mx-auto px-6">
          <SectionLabel text="Journal" />
          <h2 className="text-dark text-4xl font-playfair font-light mb-16 italic text-center">Stay Inspired @rare.wellness</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {INSTA_POSTS.map((p, i) => (
              <motion.div key={i} whileHover={{ scale: 0.98 }} className="aspect-square">
                <OptimizedImage src={p} alt="RARE" className="h-full w-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-linen py-40 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <h2 className="text-[20vw] font-playfair font-bold tracking-widest">RARE</h2>
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <ScrollReveal>
            <SectionLabel text="Your Journey" />
            <h2 className="text-dark text-6xl md:text-8xl font-playfair font-light mb-8">Your sanctuary <br /><em className="text-rose italic">awaits</em></h2>
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              <Button onClick={() => navigate('/services')}>Select a Sanctuary</Button>
              <Button variant="outline" onClick={() => navigate('/shop')}>Shop the Edit</Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
