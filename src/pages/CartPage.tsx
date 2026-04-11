import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, OptimizedImage, PageHeader } from '@/components/ui'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
  const navigate = useNavigate()
  const { state, totals, removeItem, updateQty, toggleLoyalty } = useCart()
  const { items, loyaltyApplied } = state
  const { subtotal, discount, tax, total } = totals

  if (items.length === 0) {
    return (
      <div className="bg-cream min-h-screen flex flex-col pt-32 pb-24">
        <PageHeader 
          label="Your Bag" 
          title="Begin Your <em class='text-rose italic'>Journey</em>"
          subtitle="Your bag is currently empty. Explore our collection of high-performance skincare and wellness rituals."
        />
        <div className="flex-1 flex flex-col items-center justify-center -mt-20">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-12 opacity-20"
          >
            <ShoppingBag className="w-32 h-32 text-dark" strokeWidth={1} />
          </motion.div>
          <Button variant="default" className="px-12 h-14" onClick={() => navigate('/shop')}>
            Go to Shop
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen pb-32">
      <PageHeader 
        label="Your Bag" 
        title="Curated <em class='text-rose italic'>Rituals</em>"
        subtitle={`${items.length} items selected for your personal sanctuary.`}
      />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col sm:flex-row gap-8 p-10 bg-linen border border-dark/5 shadow-sm rounded-sm group relative"
              >
                <div className="w-full sm:w-40 h-48 bg-cream overflow-hidden rounded-sm flex-shrink-0">
                  <OptimizedImage 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-700" 
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-[4px] text-mauve/60 font-medium">{item.brand}</p>
                      <h3 className="font-playfair text-2xl text-dark leading-tight">{item.name}</h3>
                      <p className="text-mauve text-xs font-light tracking-wide italic">{item.variation}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-dark/20 hover:text-rose transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-8">
                    <div className="flex items-center border border-dark/10 bg-cream/50 h-10 px-2 rounded-full">
                      <button 
                        onClick={() => updateQty(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-dark hover:text-gold transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-medium">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center text-dark hover:text-gold transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="font-playfair text-xl text-dark">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
          <div className="p-10 bg-linen border border-dark/5 shadow-xl space-y-10 rounded-sm">
            <h3 className="font-playfair text-2xl text-dark italic border-b border-dark/5 pb-6">Summary</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between text-sm">
                <span className="text-mauve font-light">Subtotal</span>
                <span className="text-dark font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              
              <AnimatePresence>
                {loyaltyApplied && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-rose font-medium flex items-center gap-2">
                       <Sparkles className="w-3 h-3" /> Glow Discount
                    </span>
                    <span className="text-rose font-medium">-₹{discount.toFixed(2)}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between text-sm">
                <span className="text-mauve font-light">Tax (8.75%)</span>
                <span className="text-dark font-medium">₹{tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-mauve font-light">Shipping</span>
                <span className="text-dark/40 italic">Calculated next</span>
              </div>
            </div>

            {/* Loyalty Points Engagement */}
            <div className="p-6 bg-dark text-cream space-y-6 shadow-lg rounded-sm">
              <div className="flex justify-between items-center">
                <p className="text-[10px] uppercase tracking-[3px] text-gold font-medium">Glow Rewards</p>
                <div 
                  onClick={toggleLoyalty}
                  className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors duration-300 ${loyaltyApplied ? 'bg-gold' : 'bg-cream/10'}`}
                >
                  <motion.div 
                    animate={{ x: loyaltyApplied ? 20 : 0 }}
                    className="absolute top-1 left-1 w-3 h-3 bg-cream rounded-full"
                  />
                </div>
              </div>
              <p className="text-[11px] font-light leading-relaxed text-cream/60">
                You have <strong className="text-gold font-medium">2,450 points</strong> available. Apply 500 points for a <strong className="text-cream font-medium">10% discount</strong> on this ritual.
              </p>
            </div>

            <div className="pt-6 border-t border-dark/5">
              <div className="flex justify-between items-end mb-10">
                <span className="font-playfair text-lg text-dark">Total</span>
                <span className="font-playfair text-3xl text-dark">₹{total.toFixed(2)}</span>
              </div>
              <Button 
                variant="default" 
                className="w-full h-16 text-xs tracking-[4px] group"
                onClick={() => navigate('/checkout')}
              >
                Checkout <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="text-center pt-4">
              <p className="text-[9px] uppercase tracking-[2px] text-mauve/40 font-medium">Secure Payment & Carbon-Neutral Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
