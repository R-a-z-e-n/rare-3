import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, CheckCircle2, Lock, CreditCard, Truck, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, SectionLabel } from '@/components/ui'
import { useCart } from '@/context/CartContext'
import { useCheckout } from '@/hooks/useCheckout'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { StripePaymentForm } from '@/components/checkout/StripePaymentForm'

// Initialize Stripe (Placeholder Key)
const stripePromise = loadStripe('pk_test_rare_wellness_placeholder')

const STEPS = [
  { id: 'info', label: 'Information', icon: User },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'payment', label: 'Payment', icon: CreditCard },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { state, totals, clearCart } = useCart()
  const { items } = state
  const { subtotal, discount, tax, total } = totals
  
  const [currentStep, setCurrentStep] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  })

  const checkoutMutation = useCheckout()
  const handleNext = () => setCurrentStep(s => s + 1)

  const processOrder = (paymentMethodId?: string) => {
    const finalData = { ...formData, paymentMethodId }
    checkoutMutation.mutate(finalData, {
      onSuccess: (data) => {
        setOrderId(data.orderId)
        setIsSuccess(true)
        clearCart()
      }
    })
  }

  if (isSuccess) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="flex justify-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className="w-24 h-24 bg-gold rounded-full flex items-center justify-center shadow-2xl"
            >
              <CheckCircle2 className="w-12 h-12 text-dark" strokeWidth={2.5} />
            </motion.div>
          </div>
          <div className="space-y-4">
            <h1 className="font-playfair text-4xl text-dark">Ritual <em className="text-rose italic">Confirmed</em></h1>
            <p className="text-mauve text-sm leading-relaxed font-light">
              Your order {orderId} is being prepared in our sanctuary. You'll receive a confirmation email shortly.
            </p>
          </div>
          <Button variant="default" className="w-full h-14" onClick={() => navigate('/shop')}>
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-12">
            <button 
              onClick={() => currentStep === 0 ? navigate('/cart') : setCurrentStep(s => s - 1)}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-mauve hover:text-gold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back {currentStep === 0 ? 'to Bag' : ''}
            </button>

            {/* Stepper */}
            <div className="flex justify-between relative mb-16">
              <div className="absolute top-1/2 left-0 w-full h-px bg-dark/5 -translate-y-1/2" />
              {STEPS.map((step, i) => (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${
                    i <= currentStep ? 'bg-dark text-gold shadow-lg' : 'bg-linen text-mauve/40 border border-dark/5'
                  }`}>
                    <step.icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] uppercase tracking-[2px] font-medium ${i <= currentStep ? 'text-dark' : 'text-mauve/40'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Form Content */}
            <div className="space-y-8 bg-linen/30 p-10 rounded-sm border border-dark/5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {currentStep === 0 && (
                    <>
                      <SectionLabel text="Contact Information" />
                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-mauve font-medium ml-1">Email Address</label>
                          <input 
                            type="email" 
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            placeholder="sarah@example.com" 
                            className="w-full bg-cream border-none p-4 text-sm focus:ring-1 focus:ring-gold outline-none" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-mauve font-medium ml-1">First Name</label>
                          <input 
                            type="text" 
                            value={formData.firstName}
                            onChange={e => setFormData({...formData, firstName: e.target.value})}
                            placeholder="Sarah" 
                            className="w-full bg-cream border-none p-4 text-sm focus:ring-1 focus:ring-gold outline-none" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-mauve font-medium ml-1">Last Name</label>
                          <input 
                            type="text" 
                            value={formData.lastName}
                            onChange={e => setFormData({...formData, lastName: e.target.value})}
                            placeholder="Montgomery" 
                            className="w-full bg-cream border-none p-4 text-sm focus:ring-1 focus:ring-gold outline-none" 
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {currentStep === 1 && (
                    <>
                      <SectionLabel text="Shipping Destination" />
                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-mauve font-medium ml-1">Street Address</label>
                          <input 
                            type="text" 
                            value={formData.address}
                            onChange={e => setFormData({...formData, address: e.target.value})}
                            placeholder="123 Sanctuary Way" 
                            className="w-full bg-cream border-none p-4 text-sm focus:ring-1 focus:ring-gold outline-none" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-mauve font-medium ml-1">City</label>
                          <input 
                            type="text" 
                            value={formData.city}
                            onChange={e => setFormData({...formData, city: e.target.value})}
                            placeholder="Malibu" 
                            className="w-full bg-cream border-none p-4 text-sm focus:ring-1 focus:ring-gold outline-none" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-mauve font-medium ml-1">ZIP Code</label>
                          <input 
                            type="text" 
                            value={formData.zip}
                            onChange={e => setFormData({...formData, zip: e.target.value})}
                            placeholder="90265" 
                            className="w-full bg-cream border-none p-4 text-sm focus:ring-1 focus:ring-gold outline-none" 
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {currentStep === 2 && (
                    <Elements stripe={stripePromise}>
                      <StripePaymentForm 
                        onSuccess={(id) => processOrder(id)}
                        onBack={() => setCurrentStep(s => s - 1)}
                        isPending={checkoutMutation.isPending}
                      />
                    </Elements>
                  )}
                </motion.div>
              </AnimatePresence>

              {currentStep < 2 && (
                <div className="pt-8 text-center">
                  <Button 
                    variant="default" 
                    className="w-full h-16 text-xs tracking-[4px]"
                    onClick={handleNext}
                  >
                    Continue to {STEPS[currentStep + 1].label}
                  </Button>
                  <p className="text-[9px] text-mauve/40 mt-6 flex items-center justify-center gap-2">
                    <Lock className="w-3 h-3" /> Secure data encryption & carbon-neutral delivery.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-5 h-fit lg:sticky lg:top-32">
            <div className="bg-linen p-10 border border-dark/5 shadow-sm space-y-8 rounded-sm">
              <h3 className="font-playfair text-xl text-dark italic border-b border-dark/5 pb-6">In Your Bag</h3>
              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-cream flex-shrink-0 overflow-hidden rounded-sm">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-sm font-medium text-dark line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-mauve/60 uppercase tracking-widest mt-1">Qty {item.qty} · ₹{item.price}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-playfair text-dark">₹{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 pt-6 border-t border-dark/5">
                <div className="flex justify-between text-xs">
                  <span className="text-mauve font-light">Subtotal</span>
                  <span className="text-dark font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                   <div className="flex justify-between text-xs">
                    <span className="text-rose font-medium">Glow Discount</span>
                    <span className="text-rose font-medium">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-mauve font-light">Shipping</span>
                  <span className="text-dark font-medium tracking-widest uppercase text-[9px]">Gratis</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-mauve font-light">Estimated Tax</span>
                  <span className="text-dark font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg pt-4 border-t border-dark/5 font-playfair">
                  <span className="text-dark">Total</span>
                  <span className="text-dark font-medium">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
