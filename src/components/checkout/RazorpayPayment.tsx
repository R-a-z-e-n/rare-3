import { useState } from 'react'
import { Button, SectionLabel } from '@/components/ui'
import { Lock, Smartphone } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'

interface RazorpayPaymentProps {
  onSuccess: (paymentId: string) => void
  onBack: () => void
  isPending: boolean
  amount: number
  formData: any
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export function RazorpayPayment({ onSuccess, onBack, isPending, amount, formData }: RazorpayPaymentProps) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    try {
      setLoading(true)

      // 1. Create order on the server
      const { data: order } = await axios.post('/api/payments/create-order', {
        amount: amount,
        currency: 'INR'
      })

      // 2. Options for Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'RARE Wellness',
        description: 'UPI, QR, Cards, and NetBanking',
        image: 'https://cdn.razorpay.com/logos/H9u9Y38079u9Y3_medium.png', // Optional: You can put your logo URL here
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const { data: verification } = await axios.post('/api/payments/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })

            if (verification.status === 'ok') {
              toast.success('Payment successful!')
              onSuccess(response.razorpay_payment_id)
            } else {
              toast.error('Payment verification failed.')
            }
          } catch (err) {
            console.error('Verification error:', err)
            toast.error('Error verifying payment.')
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: '',
        },
        theme: {
          color: '#1a1a1a',
        },
        // Show only UPI (QR) and Card options
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay via UPI / QR',
                instruments: [
                  {
                    method: 'upi',
                    protocols: ['vpa', 'qr']
                  }
                ]
              },
              card: {
                name: 'Credit / Debit Card',
                instruments: [
                  {
                    method: 'card'
                  }
                ]
              }
            },
            sequence: ['block.upi', 'block.card'],
            preferences: {
              show_default_blocks: false,
            },
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`)
      })
      rzp.open()
    } catch (error) {
      console.error('Razorpay Error:', error)
      toast.error('Could not initialize Razorpay. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <SectionLabel text="Payment Method" />

      <div className="bg-cream p-8 rounded-sm border border-dark/5 space-y-6">
        <div className="flex items-center gap-4 text-dark italic font-playfair text-lg">
          <Smartphone className="w-5 h-5 text-gold" />
          Razorpay Secure Checkout
        </div>

        <p className="text-xs text-mauve/60 leading-relaxed">
          Pay securely via <strong>UPI (QR Code, Google Pay)</strong> or <strong>Credit/Debit Cards</strong>.
          Your payment is processed securely by Razorpay.
        </p>

        <div className="pt-2 flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-5" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" className="h-4" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-3" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
        </div>
      </div>

      <div className="pt-8 space-y-4">
        <Button
          variant="default"
          className="w-full h-16 text-xs tracking-[4px]"
          onClick={handlePayment}
          disabled={loading || isPending}
        >
          {loading ? 'INITIALIZING...' : 'PAY NOW'}
        </Button>
        <button
          onClick={onBack}
          className="w-full text-[10px] uppercase tracking-widest text-mauve hover:text-dark transition-colors"
        >
          Return to Shipping
        </button>
        <p className="text-[9px] text-mauve/40 mt-6 flex items-center justify-center gap-2">
          <Lock className="w-3 h-3" /> All transactions are highly encrypted.
        </p>
      </div>
    </div>
  )
}
