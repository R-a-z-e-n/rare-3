import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button, SectionLabel } from '@/components/ui'
import { toast } from 'sonner'
import { useBooking } from '@/hooks/useBooking'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  serviceName: string
}

export function BookingModal({ isOpen, onClose, serviceName }: BookingModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '1',
    name: '',
    email: '',
    notes: ''
  })

  const booking = useBooking()

  const handleNext = () => setStep(s => s + 1)
  const handleBack = () => setStep(s => s - 1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    booking.mutate({ ...formData, serviceName }, {
      onSuccess: () => {
        toast.success(`Booking confirmed for ${serviceName}!`)
        setStep(3)
      },
      onError: () => {
        toast.error('Could not complete reservation. The sanctuary is currently at capacity.')
      }
    })
  }

  const resetAndClose = () => {
    setStep(1)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
          className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-cream w-full max-w-lg overflow-hidden shadow-2xl rounded-sm"
        >
          {/* Header */}
          <div className="bg-linen p-6 flex justify-between items-center border-b border-dark/5">
            <div>
              <SectionLabel text="Reservation" />
              <h3 className="font-playfair text-xl text-dark">{serviceName}</h3>
            </div>
            <button onClick={resetAndClose} className="text-mauve hover:text-dark transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-dark/5 w-full">
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              className="h-full bg-gold transition-all duration-500"
            />
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-mauve mb-2">Select Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                        <input 
                          type="date" 
                          className="w-full bg-linen border-none p-4 pl-12 text-sm focus:ring-1 focus:ring-gold outline-none"
                          value={formData.date}
                          onChange={e => setFormData({...formData, date: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-mauve mb-4">Select Time Slot</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setFormData({ ...formData, time: slot })}
                            className={`py-3 px-2 text-[10px] tracking-widest transition-all rounded-sm border ${
                              formData.time === slot
                                ? 'bg-rose text-cream border-rose shadow-md'
                                : 'bg-linen/30 text-mauve border-rose/10 hover:border-rose/30'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                      {!formData.date || !formData.time ? (
                        <p className="text-[9px] text-rose/60 mt-4 italic">Please select a date and time slot to proceed</p>
                      ) : null}
                    </div>

                    <Button onClick={handleNext} className="w-full" disabled={!formData.date || !formData.time}>
                      Continue to Details <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="bg-linen/50 p-4 mb-6 border border-gold/10 rounded-sm">
                    <p className="text-[10px] uppercase tracking-widest text-mauve/60 mb-2">Reservation Summary</p>
                    <div className="flex justify-between items-end">
                      <p className="font-playfair text-dark italic">{serviceName}</p>
                      <p className="text-xs text-gold font-light">{formData.date} • {formData.time} • {formData.guests} {formData.guests === '1' ? 'Guest' : 'Guests'}</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      required
                      className="w-full bg-linen border-none p-4 text-sm focus:ring-1 focus:ring-gold outline-none"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      required
                      className="w-full bg-linen border-none p-4 text-sm focus:ring-1 focus:ring-gold outline-none"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                    <textarea 
                      placeholder="Special Requests (Optional)" 
                      rows={3}
                      className="w-full bg-linen border-none p-4 text-sm focus:ring-1 focus:ring-gold outline-none resize-none"
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                    />
                    <p className="text-[9px] text-mauve/50 font-light leading-relaxed mb-4 italic">
                      * Cancellations must be made 24 hours in advance to receive a full refund of the sanctuary deposit.
                    </p>
                    <div className="flex gap-4 pt-4">
                      <Button type="button" variant="outline" onClick={handleBack} className="flex-1">Back</Button>
                      <Button type="submit" className="flex-[2]" disabled={booking.isPending}>
                        {booking.isPending ? 'Confirming...' : 'Confirm Booking'}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/10 text-gold mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-playfair text-2xl text-dark mb-4">Reservation Confirmed</h3>
                  <p className="text-mauve text-sm mb-8 max-w-xs mx-auto">
                    A confirmation email has been sent to {formData.email}. We look forward to seeing you.
                  </p>
                  <Button onClick={resetAndClose} className="w-full">Done</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
