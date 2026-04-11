import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui'
import { useSignup } from '@/hooks/useAuth'

export default function SignupPage() {
  const navigate = useNavigate()
  const signup = useSignup()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signup.mutate({ name, email, password }, {
      onSuccess: (data) => {
        localStorage.setItem('ra_user', JSON.stringify(data))
        toast.success('Your sanctuary is ready. Welcome to RARE.')
        navigate('/dashboard')
      }
    })
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-auto space-y-8"
      >
        <div className="text-center">
          <Link to="/" className="font-playfair text-3xl text-dark tracking-widest uppercase">RARE</Link>
          <h2 className="mt-6 text-3xl font-playfair text-dark italic">Create Account</h2>
          <p className="mt-2 text-sm text-mauve">Join our wellness collective</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-sm shadow-sm">
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs uppercase tracking-widest text-mauve">Full Name</label>
              <input 
                id="name"
                type="text" 
                required
                placeholder="Sarah Montgomery"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label="Full Name"
                className="w-full bg-linen border-none p-4 text-sm text-dark focus:ring-1 focus:ring-gold outline-none rounded-sm" 
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-xs uppercase tracking-widest text-mauve">Email Address</label>
              <input 
                id="email"
                type="email" 
                required
                placeholder="sarah@rarewellness.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email Address"
                className="w-full bg-linen border-none p-4 text-sm text-dark focus:ring-1 focus:ring-gold outline-none rounded-sm" 
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-xs uppercase tracking-widest text-mauve">Password</label>
              <input 
                id="password"
                type="password" 
                required
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
                className="w-full bg-linen border-none p-4 text-sm text-dark focus:ring-1 focus:ring-gold outline-none rounded-sm" 
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full py-4 text-xs tracking-widest uppercase"
            isLoading={signup.isPending}
          >
            Create Account
          </Button>

          <p className="text-center text-mauve text-xs">
            Already have an account? {' '}
            <Link to="/login" className="text-gold font-medium hover:underline underline-offset-4">Log In</Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}
