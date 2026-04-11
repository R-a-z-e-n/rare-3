import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2, Users, Star, TrendingUp, Shield, Check, 
  Sparkles, Scissors, Activity, MapPin, Calendar, 
  Globe, Home, User, Phone, Mail, Upload 
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface PartnerFormData {
  providerType: string
  businessName: string
  yearsInOperation: string
  location: string
  address: string
  website: string
  contactName: string
  contactPhone: string
  email: string
  description: string
  priceRange: string
  serviceTags: string[]
  images: File[]
  agreedToTerms: boolean
}

const BENEFITS = [
  { icon: Users, stat: '50K+', label: 'Active Members' },
  { icon: Star, stat: '4.9', label: 'Avg Partner Rating' },
  { icon: TrendingUp, stat: '3x', label: 'Revenue Growth' },
  { icon: Shield, stat: '100%', label: 'Verified Listings' },
]

const STEPS = ['Business Type', 'Your Details', 'Review & Submit']

const PROVIDER_TYPES = [
  {
    id: 'spa',
    icon: Sparkles,
    title: 'Spa & Wellness',
    description: 'Day spas, wellness centers, holistic treatments',
  },
  {
    id: 'salon',
    icon: Scissors,
    title: 'Salon & Beauty',
    description: 'Hair, nails, makeup, and grooming studios',
  },
  {
    id: 'fitness',
    icon: Activity,
    title: 'Fitness & Yoga',
    description: 'Yoga studios, personal training, meditation centers',
  },
  {
    id: 'retreat',
    icon: MapPin,
    title: 'Retreat & Destination',
    description: 'Wellness retreats, resorts, travel experiences',
  },
]

const SERVICE_TAGS = [
  'Massage', 'Facial', 'Body Wrap', 'Yoga', 'Meditation',
  'Hair', 'Nails', 'Nutrition', 'Personal Training', 'Detox',
  'Aromatherapy', 'Ayurveda', 'Hydrotherapy', 'Cryotherapy'
]

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0
  })
}

export function PartnerOnboarding() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<PartnerFormData>({
    providerType: '',
    businessName: '',
    yearsInOperation: '',
    location: '',
    address: '',
    website: '',
    contactName: '',
    contactPhone: '',
    email: '',
    description: '',
    priceRange: '',
    serviceTags: [],
    images: [],
    agreedToTerms: false,
  })

  const updateForm = (field: keyof PartnerFormData, value: any) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const toggleTag = (tag: string) => {
    const tags = formData.serviceTags.includes(tag)
      ? formData.serviceTags.filter(t => t !== tag)
      : [...formData.serviceTags, tag]
    updateForm('serviceTags', tags)
  }

  const goNext = () => {
    setDirection(1)
    setCurrentStep(s => s + 1)
  }

  const goBack = () => {
    setDirection(-1)
    setCurrentStep(s => s - 1)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSubmitted(true)
    setSubmitting(false)
    toast.success('Application submitted! Our team will contact you within 48 hours \u2726')
  }

  const isStep1Valid = !!formData.providerType
  const isStep2Valid = !!(
    formData.businessName && 
    formData.location && 
    formData.address && 
    formData.contactName && 
    formData.contactPhone && 
    formData.email
  )

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-24 px-8 max-w-2xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-8"
        >
          <Check className="w-8 h-8 text-gold" />
        </motion.div>

        <p className="text-[9px] uppercase tracking-[0.3em] text-gold/60 mb-4 font-medium">
          APPLICATION RECEIVED
        </p>
        <h2 className="font-playfair text-4xl text-dark font-light mb-4">
          Welcome to the <em className="text-rose italic">Collective.</em>
        </h2>
        <p className="text-mauve text-sm leading-relaxed max-w-[400px] mx-auto mb-10 font-light">
          Our curation team will review your sanctuary and reach out within 
          48 hours. Prepare to elevate your clientele.
        </p>

        <div className="bg-linen px-8 py-4 inline-block mb-10 border border-dark/5">
          <p className="text-[9px] uppercase tracking-widest text-muted mb-1 font-medium">
            Reference Number
          </p>
          <p className="font-playfair text-dark text-lg">
            RARE-{Date.now().toString().slice(-6)}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => { setCurrentStep(0); setSubmitted(false); setFormData({ ...formData, agreedToTerms: false }) }}
            className="border border-dark text-dark px-10 py-4 text-[10px] uppercase tracking-widest hover:bg-dark hover:text-cream transition-all duration-300 font-medium"
          >
            Submit Another
          </button>
          <button
            onClick={() => navigate('/services')}
            className="bg-dark text-cream px-10 py-4 text-[10px] uppercase tracking-widest hover:bg-dark/90 transition-all duration-300 font-medium"
          >
            Explore Partners →
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[700px] bg-cream shadow-2xl rounded-sm overflow-hidden border border-dark/5">
      {/* Left Panel */}
      <div className="lg:w-[38%] bg-dark p-10 lg:p-16 flex flex-col justify-between relative overflow-hidden text-cream">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10">
          <p className="text-[9px] uppercase tracking-[0.3em] text-gold/60 mb-12 font-medium">
            ✦ RARE PARTNER COLLECTIVE
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-[clamp(32px,3vw,44px)] font-light leading-tight">
            Grow your<br />
            <em className="text-gold italic">Sanctuary</em><br />
            with RARE.
          </h2>
          <p className="text-cream/50 text-sm leading-relaxed mt-6 max-w-[280px] font-light">
            Join an elite network of wellness destinations 
            trusted by thousands of high-performance clients.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-12">
            {BENEFITS.map((benefit, i) => (
              <div key={i} className="flex items-center gap-4 p-5 border border-gold/10 hover:border-gold/30 transition-all duration-500 bg-white/5">
                <div className="w-10 h-10 bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="font-playfair text-xl text-cream font-light">{benefit.stat}</p>
                  <p className="text-[9px] uppercase tracking-widest text-muted font-medium">{benefit.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-16 pt-10 border-t border-cream/10">
          <p className="font-playfair italic text-cream/50 text-base leading-relaxed pl-6 border-l-2 border-gold/30">
            "RARE elevated our bookings by 3x in the first quarter. 
            The clientele is exactly who we want."
          </p>
          <p className="text-[10px] uppercase tracking-widest text-gold/40 mt-4 font-medium">
            — Priya Sharma, Lume Wellness Spa
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="lg:w-[62%] bg-cream p-8 md:p-16 flex flex-col">
        {/* Step Indicator */}
        <div className="flex items-center mb-16 max-w-md mx-auto w-full">
          {STEPS.map((label, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center relative">
                <div className={cn(
                  "w-10 h-10 flex items-center justify-center text-[11px] font-medium transition-all duration-500 rounded-none border",
                  i < currentStep ? "bg-gold border-gold text-dark" :
                  i === currentStep ? "bg-dark border-dark text-cream" :
                  "bg-linen border-transparent text-muted"
                )}>
                  {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <p className={cn(
                  "text-[9px] uppercase tracking-widest mt-3 absolute -bottom-6 whitespace-nowrap font-medium",
                  i === currentStep ? "text-dark" : "text-muted"
                )}>{label}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  "flex-1 h-px mx-4 transition-all duration-700",
                  i < currentStep ? "bg-gold" : "bg-linen"
                )} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 mt-6">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {currentStep === 0 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-playfair text-3xl text-dark mb-2">What best describes your business?</h3>
                    <p className="text-mauve text-sm font-light">Select the type that fits your offering.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PROVIDER_TYPES.map(type => (
                      <button
                        key={type.id}
                        onClick={() => updateForm('providerType', type.id)}
                        className={cn(
                          "p-8 border text-left transition-all duration-500 group relative overflow-hidden",
                          formData.providerType === type.id
                            ? "border-rose bg-rose/[0.03] shadow-inner"
                            : "border-linen hover:border-rose/30 bg-white shadow-sm hover:shadow-md"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 flex items-center justify-center mb-6 transition-colors duration-500",
                          formData.providerType === type.id ? "bg-rose/10" : "bg-linen"
                        )}>
                          <type.icon className={cn(
                            "w-5 h-5",
                            formData.providerType === type.id ? "text-rose" : "text-muted"
                          )} />
                        </div>
                        <p className="font-playfair text-dark text-lg font-light mb-2">{type.title}</p>
                        <p className="text-[11px] text-mauve leading-relaxed font-light">{type.description}</p>
                        {formData.providerType === type.id && (
                          <div className="flex items-center gap-2 mt-4">
                            <Check className="w-3.5 h-3.5 text-rose" />
                            <span className="text-[10px] text-rose uppercase tracking-[2px] font-medium">Selected</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end pt-8">
                    <button
                      disabled={!isStep1Valid}
                      onClick={goNext}
                      className={cn(
                        "px-12 py-4 text-[10px] uppercase tracking-[3px] font-medium transition-all duration-300",
                        isStep1Valid ? "bg-dark text-cream hover:bg-dark/90" : "bg-linen text-muted cursor-not-allowed"
                      )}
                    >
                      CONTINUE →
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-playfair text-3xl text-dark mb-2">Tell us about your sanctuary</h3>
                    <p className="text-mauve text-sm font-light">Provide the core details of your business.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField 
                      label="Business Name" 
                      icon={Building2} 
                      placeholder="Lume Wellness Spa" 
                      value={formData.businessName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm('businessName', e.target.value)}
                      required
                    />
                    <FormField 
                      label="Years in Operation" 
                      icon={Calendar} 
                      placeholder="e.g. 5 years" 
                      value={formData.yearsInOperation}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm('yearsInOperation', e.target.value)}
                    />
                    <FormField 
                      label="City / Location" 
                      icon={MapPin} 
                      placeholder="Beverly Hills, CA" 
                      value={formData.location}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm('location', e.target.value)}
                      required
                    />
                    <FormField 
                      label="Website (Optional)" 
                      icon={Globe} 
                      placeholder="www.yourspa.com" 
                      value={formData.website}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm('website', e.target.value)}
                    />
                    <div className="md:col-span-2">
                      <FormField 
                        label="Business Address" 
                        icon={Home} 
                        placeholder="Full address including pincode" 
                        value={formData.address}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm('address', e.target.value)}
                        required
                      />
                    </div>
                    <FormField 
                      label="Contact Name" 
                      icon={User} 
                      placeholder="Your full name" 
                      value={formData.contactName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm('contactName', e.target.value)}
                      required
                    />
                    <FormField 
                      label="Contact Number" 
                      icon={Phone} 
                      placeholder="+91 98765 43210" 
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm('contactPhone', e.target.value)}
                      required
                    />
                    <div className="md:col-span-2">
                      <FormField 
                        label="Email Address" 
                        icon={Mail} 
                        placeholder="hello@yourbusiness.com" 
                        type="email"
                        value={formData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.25em] text-muted mb-4 font-medium">
                        Describe your services
                      </label>
                      <div className="bg-linen/50 border border-dark/5 px-6 py-5 focus-within:border-gold/30 transition-colors">
                        <textarea
                          rows={4}
                          value={formData.description}
                          onChange={(e) => updateForm('description', e.target.value)}
                          placeholder="Tell us what makes your wellness offering unique — treatments, specialties, signature experiences..."
                          className="bg-transparent border-none outline-none text-dark text-sm w-full placeholder:text-muted/50 font-light resize-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.25em] text-muted mb-4 font-medium">
                        Price Range
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {['Budget', 'Mid-range', 'Premium', 'Luxury'].map(range => (
                          <button
                            key={range}
                            onClick={() => updateForm('priceRange', range)}
                            className={cn(
                              "px-6 py-2.5 text-[10px] uppercase tracking-widest transition-all duration-300 border font-medium",
                              formData.priceRange === range 
                                ? "bg-rose border-rose text-cream shadow-md" 
                                : "bg-white border-linen text-muted hover:border-rose/30 hover:text-dark"
                            )}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.25em] text-muted mb-4 font-medium">
                        Services Offered
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {SERVICE_TAGS.map(tag => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={cn(
                              "px-4 py-2 text-[10px] uppercase tracking-widest transition-all duration-300 border",
                              formData.serviceTags.includes(tag)
                                ? "bg-dark border-dark text-cream"
                                : "bg-white border-linen text-muted/60 hover:text-dark hover:border-dark/20"
                            )}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.25em] text-muted mb-4 font-medium">
                        Business Images (Optional)
                      </label>
                      <div className="border border-dashed border-gold/30 p-10 text-center hover:border-gold/60 transition-all duration-300 bg-linen/20 group">
                        <Upload className="w-10 h-10 text-gold/30 mx-auto mb-4 group-hover:text-gold/50 transition-colors" />
                        <p className="text-sm text-mauve font-light">
                          Drop your photos here or{' '}
                          <span className="text-rose underline cursor-pointer hover:text-rose/80">browse</span>
                        </p>
                        <p className="text-[10px] text-muted/50 mt-3 italic">
                          JPG, PNG up to 5MB each · Max 5 images
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-10 border-t border-dark/5">
                    <button
                      onClick={goBack}
                      className="px-10 py-4 border border-dark text-dark text-[10px] uppercase tracking-[3px] font-medium hover:bg-dark hover:text-cream transition-all duration-500"
                    >
                      ← BACK
                    </button>
                    <button
                      disabled={!isStep2Valid}
                      onClick={goNext}
                      className={cn(
                        "px-12 py-4 text-[10px] uppercase tracking-[3px] font-medium transition-all duration-500 shadow-sm",
                        isStep2Valid ? "bg-dark text-cream hover:bg-dark/90" : "bg-linen text-muted cursor-not-allowed"
                      )}
                    >
                      CONTINUE →
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-playfair text-3xl text-dark mb-2">Review your submission</h3>
                    <p className="text-mauve text-sm font-light">Ensure all details are correct before applying.</p>
                  </div>

                  <div className="bg-linen/40 p-8 border border-dark/5 shadow-inner">
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-dark/5">
                      <div className="w-12 h-12 bg-rose/10 flex items-center justify-center">
                        {(() => {
                          const Icon = PROVIDER_TYPES.find(p => p.id === formData.providerType)?.icon || Sparkles
                          return <Icon className="w-6 h-6 text-rose" />
                        })()}
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-muted font-medium">Provider Type</p>
                        <p className="font-playfair text-dark text-xl font-light">
                          {PROVIDER_TYPES.find(p => p.id === formData.providerType)?.title}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                      {[
                        ['Business Name', formData.businessName],
                        ['Location', formData.location],
                        ['Contact', formData.contactName],
                        ['Email', formData.email],
                        ['Phone', formData.contactPhone],
                        ['Price Range', formData.priceRange],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p className="text-[9px] uppercase tracking-widest text-muted mb-2 font-medium">{label}</p>
                          <p className="text-dark text-sm font-light border-l-2 border-gold/20 pl-4">{value || '—'}</p>
                        </div>
                      ))}
                    </div>

                    {formData.serviceTags.length > 0 && (
                      <div className="mt-10 pt-8 border-t border-dark/5">
                        <p className="text-[9px] uppercase tracking-widest text-muted mb-4 font-medium">Services Offered</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.serviceTags.map(t => (
                            <span key={t} className="bg-white px-4 py-1.5 text-[9px] uppercase tracking-widest text-dark border border-dark/5">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={goBack}
                      className="mt-8 text-rose text-[11px] underline font-medium hover:text-rose/80 transition-colors uppercase tracking-widest"
                    >
                      ← Edit Details
                    </button>
                  </div>

                  <div className="space-y-8">
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="relative flex items-center mt-0.5">
                        <input
                          type="checkbox"
                          checked={formData.agreedToTerms}
                          onChange={(e) => updateForm('agreedToTerms', e.target.checked)}
                          className="peer appearance-none w-5 h-5 border border-dark/20 bg-white checked:bg-dark transition-all"
                        />
                        <Check className="absolute w-3.5 h-3.5 text-cream opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none transition-opacity" />
                      </div>
                      <span className="text-mauve text-xs leading-relaxed font-light group-hover:text-dark transition-colors">
                        I confirm that all details are accurate and I agree to RARE's 
                        <span className="underline ml-1">Partner Terms and Listing Guidelines</span>.
                      </span>
                    </label>

                    <div className="flex flex-col gap-4">
                      <button
                        disabled={!formData.agreedToTerms || submitting}
                        onClick={handleSubmit}
                        className={cn(
                          "w-full py-5 text-[11px] uppercase tracking-[4px] transition-all duration-500 font-medium flex items-center justify-center gap-3 shadow-lg",
                          formData.agreedToTerms && !submitting ? "bg-dark text-cream hover:bg-dark/95" : "bg-linen text-muted cursor-not-allowed"
                        )}
                      >
                        {submitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                              className="w-4 h-4 border-2 border-cream/20 border-t-cream rounded-full"
                            />
                            SUBMITTING...
                          </>
                        ) : (
                          "SUBMIT MY APPLICATION →"
                        )}
                      </button>
                      <button
                        onClick={goBack}
                        disabled={submitting}
                        className="text-[10px] uppercase tracking-widest text-muted hover:text-dark transition-colors text-center py-2"
                      >
                        Back to details
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function FormField({ label, icon: Icon, placeholder, value, onChange, required, type = 'text' }: any) {
  return (
    <div className="space-y-3">
      <label className="block text-[10px] uppercase tracking-[0.25em] text-muted font-medium">
        {label} {required && <span className="text-rose">*</span>}
      </label>
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gold/40 group-focus-within:text-gold transition-colors">
          <Icon className="w-4 h-4" />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-white border border-linen p-4 pl-14 text-sm font-light text-dark outline-none focus:border-gold/30 focus:shadow-sm transition-all placeholder:text-muted/30"
        />
      </div>
    </div>
  )
}
