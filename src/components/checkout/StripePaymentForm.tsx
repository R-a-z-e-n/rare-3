import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui'
import { Lock, CreditCard } from 'lucide-react'

interface StripePaymentFormProps {
  onSuccess: (paymentMethodId: string) => void
  onBack: () => void
  isPending: boolean
}

export function StripePaymentForm({ onSuccess, onBack, isPending }: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) return

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    })

    if (error) {
      setError(error.message || 'Payment failed')
    } else {
      onSuccess(paymentMethod.id)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-linen/50 p-6 border border-gold/20 rounded-sm">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-5 h-5 text-gold" />
          <span className="text-sm font-medium text-dark uppercase tracking-widest">Secure Payment</span>
        </div>

        <div className="bg-cream p-4 rounded-sm border border-dark/5 shadow-inner min-h-[50px]">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '14px',
                  color: '#1e1e1e',
                  fontFamily: 'Inter, sans-serif',
                  '::placeholder': {
                    color: '#a09890',
                  },
                },
                invalid: {
                  color: '#c8856a',
                },
              },
            }} 
          />
        </div>

        {error && (
          <p className="mt-4 text-xs text-rose italic font-light">
            {error}
          </p>
        )}
      </div>

      <p className="text-[10px] text-mauve/50 font-light leading-relaxed italic">
        * All transactions are encrypted and processed securely through Stripe. RARE Wellness does not store your card details.
      </p>

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button 
          type="submit" 
          className="flex-[2] h-16 tracking-[4px] uppercase text-[10px]" 
          disabled={!stripe || isPending}
        >
          {isPending ? 'Processing...' : 'Place Secure Order'} <Lock className="ml-2 w-3 h-3" />
        </Button>
      </div>
    </form>
  )
}
