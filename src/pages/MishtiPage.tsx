import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Camera, Zap, Sparkles, Fingerprint, Layers } from 'lucide-react'
import { Button, Tag, PageHeader } from '@/components/ui'
import { ProductCard } from '@/components/shop/ProductCard'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import type { Product } from '@/types'

const SCAN_DATA = [
  { subject: 'Hydration', A: 78, fullMark: 100 },
  { subject: 'Elasticity', A: 64, fullMark: 100 },
  { subject: 'Clarity', A: 92, fullMark: 100 },
  { subject: 'Sensitivity', A: 22, fullMark: 100 },
  { subject: 'Texture', A: 85, fullMark: 100 },
  { subject: 'Tone', A: 70, fullMark: 100 },
]

const STEPS = ['intro', 'scanning', 'analyzing', 'results'] as const
type Step = typeof STEPS[number]

const RECOMMENDATIONS: (Product & { match: number })[] = [
  { id: 2, brand: 'Tatcha', name: 'The Dewy Skin Cream', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80', price: 68, category: 'Skincare', rating: 4.9, match: 95 },
  { id: 3, brand: 'La Mer', name: 'The Concentrate', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80', price: 450, category: 'Skincare', rating: 5.0, match: 88 },
  { id: 4, brand: 'Byredo', name: 'Gypsy Water EDP', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80', price: 180, category: 'Fragrance', rating: 4.7, match: 81 },
]

export default function MishtiPage() {
  const [step, setStep] = useState<Step>('intro')
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (step === 'scanning') {
      const timer = setTimeout(() => setStep('analyzing'), 3000)
      return () => clearTimeout(timer)
    }
    if (step === 'analyzing') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval)
            setStep('results')
            return 100
          }
          return p + 2
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [step])

  return (
    <div className="bg-cream min-h-screen pb-32">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <PageHeader 
              label="Mishti AI" 
              title="Your Personal <em class='text-rose italic'>Skin Concierge</em>"
              subtitle="Harness the power of clinical-grade AI to decode your skin's unique needs and discover your perfect ritual."
            />

            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                {[
                  { icon: Fingerprint, title: "Precision", desc: "Maps 120+ facial points to detect fine lines & texture." },
                  { icon: Layers, title: "Depth", desc: "Analyzes hydration levels across different dermal layers." },
                  { icon: Sparkles, title: "Curated", desc: "Matches you with ingredients that actually work." }
                ].map((feature, i) => (
                  <motion.div 
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="p-10 bg-linen border border-dark/5 text-center"
                  >
                    <feature.icon className="w-8 h-8 text-gold mx-auto mb-6" />
                    <h3 className="font-playfair text-xl text-dark mb-4">{feature.title}</h3>
                    <p className="text-mauve text-sm leading-relaxed font-light">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="relative group max-w-4xl mx-auto p-12 bg-dark overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80')] opacity-10 bg-cover bg-center group-hover:scale-110 transition-transform duration-1000" />
                <div className="relative z-10 text-center flex flex-col items-center">
                  <Camera className="w-12 h-12 text-gold mb-8" />
                  <h2 className="font-playfair text-3xl text-cream mb-6">Ready for Your Analysis?</h2>
                  <p className="text-cream/50 text-sm mb-10 max-w-md">
                    Position yourself in natural light for the most accurate results. The scan takes approximately 30 seconds.
                  </p>
                  <Button variant="gold" className="px-12" onClick={() => setStep('scanning')}>Start Scan</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'scanning' && (
          <motion.div 
            key="scanning"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-dark flex flex-col items-center justify-center p-6"
          >
            <div className="relative w-full max-w-sm aspect-[3/4] border-2 border-gold/30 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80')] bg-cover bg-center opacity-40" />
              <motion.div 
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_20px_#C5A267] z-20"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-dashed border-gold/20 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="mt-12 text-center">
              <p className="text-gold text-[10px] tracking-[5px] uppercase mb-4 animate-pulse">Scanning...</p>
              <h3 className="text-cream text-2xl font-playfair italic">Keep Still</h3>
            </div>
          </motion.div>
        )}

        {step === 'analyzing' && (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-cream flex flex-col items-center justify-center p-6"
          >
            <div className="w-64 h-2 bg-linen rounded-full overflow-hidden mb-8">
              <motion.div 
                className="h-full bg-gold"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-center">
              <h3 className="text-dark text-3xl font-playfair mb-4 italic">Processing Biometrics</h3>
              <p className="text-mauve text-sm font-light">
                {progress < 30 ? "Detecting hydration levels..." : 
                 progress < 60 ? "Mapping facial texture..." : 
                 "Finalizing your personalized ritual..."}
              </p>
            </div>
          </motion.div>
        )}

        {step === 'results' && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="pt-32"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col lg:flex-row gap-16 mb-24">
                {/* Score Cards */}
                <div className="flex-1 space-y-8">
                  <div className="mb-8">
                    <Tag label="Analysis Complete" variant="gold" className="mb-6" />
                    <h1 className="font-playfair text-5xl text-dark leading-tight">Your Skin <em className='text-rose italic'>DNA</em></h1>
                  </div>
                  
                  <div className="h-[400px] w-full bg-linen p-8 border border-dark/5 shadow-sm relative overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SCAN_DATA}>
                        <PolarGrid stroke="#2e1a1a" opacity={0.1} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#7a4a4a', fontSize: 10, letterSpacing: '2px' }} />
                        <Radar
                          name="Skin Profile"
                          dataKey="A"
                          stroke="#d4af7a"
                          fill="#d4af7a"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                    <div className="absolute top-8 right-8 flex flex-col gap-2">
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gold rounded-full" />
                          <span className="text-[10px] uppercase tracking-widest text-dark font-medium">Optimal</span>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations Summary */}
                <div className="lg:w-96 bg-dark p-12 flex flex-col justify-between shadow-2xl">
                  <div>
                    <Sparkles className="w-8 h-8 text-gold mb-8" />
                    <h3 className="text-cream text-2xl font-playfair mb-6 italic">Mishti's Verdict</h3>
                    <p className="text-cream/50 text-sm leading-relaxed mb-8 font-light">
                      Your skin shows signs of mild dehydration and loss of elasticity in the cheek area. We recommend a focus on moisture-binding ingredients and collagen boosters.
                    </p>
                    <div className="space-y-4 mb-12">
                      {['Hyaluronic Acid', 'Peptides', 'Squalane'].map(ing => (
                        <div key={ing} className="flex items-center gap-3">
                          <Zap className="w-3 h-3 text-gold" />
                          <span className="text-cream/80 text-xs tracking-widest uppercase">{ing}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline-cream" className="w-full" onClick={() => {
                    setStep('intro')
                    setProgress(0)
                  }}>Retake Scan</Button>
                </div>
              </div>

              {/* Product Grid */}
              <div className="mb-24">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                  <div>
                    <h2 className="font-playfair text-4xl text-dark">Your Curated <em className='text-rose italic'>Matches</em></h2>
                  </div>
                  <Button variant="outline" onClick={() => navigate('/shop')}>Explore All</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {RECOMMENDATIONS.map(p => <ProductCard key={p.id} product={p as any} />)}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
