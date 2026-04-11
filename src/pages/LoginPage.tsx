import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button, OptimizedImage } from '@/components/ui'
import { useLogin, useMobileLogin, useSendOtp } from '@/hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useLogin()
  const mobileLogin = useMobileLogin()
  const sendOtp = useSendOtp()
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [showOtpField, setShowOtpField] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }
    
    sendOtp.mutate(phone, {
      onSuccess: () => {
        setShowOtpField(true)
        toast.success('OTP sent successfully')
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (loginMethod === 'email') {
      login.mutate({ email, password }, {
        onSuccess: (data) => {
          localStorage.setItem('ra_user', JSON.stringify(data))
          toast.success(`Welcome back, ${data.name}.`)
          navigate('/dashboard')
        }
      })
    } else {
      if (!showOtpField) {
        handleSendOtp()
        return
      }
      mobileLogin.mutate({ phone, otp: otp.join('') }, {
        onSuccess: (data) => {
          localStorage.setItem('ra_user', JSON.stringify(data))
          toast.success(`Welcome back, ${data.name}. Logged in via mobile.`)
          navigate('/dashboard')
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-cream flex overflow-hidden font-cormorant">
      {/* Left: Branding Panel */}
      <div className="hidden lg:block lg:w-1/2 relative bg-dark">
        <div className="absolute top-8 left-10 z-20">
          <Link to="/" className="font-playfair text-xl tracking-[0.25em] text-cream font-light uppercase">
            RARE
          </Link>
        </div>
        <OptimizedImage 
          src="https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=1200&q=90" 
          alt="Luxury Skincare" 
          className="w-full h-full object-cover opacity-50 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
        <div className="absolute bottom-20 left-20 max-w-md space-y-4">
          <h2 className="font-playfair text-5xl text-cream leading-tight italic">
            Welcome back to <br /> <em className="text-gold">RARE.</em>
          </h2>
          <p className="text-cream/50 text-sm leading-relaxed font-light">
            Manage your profile and bookings.
          </p>
        </div>
      </div>

      {/* Right: Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 md:px-24 py-12 relative bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-auto space-y-10"
        >
          <div className="space-y-2">
            <h1 className="font-playfair text-4xl text-dark uppercase tracking-widest">Sign In</h1>
            <p className="text-mauve text-sm font-light italic">Access your wellness account</p>
          </div>

          <div className="flex bg-linen/50 p-1 rounded-sm gap-1">
            <button 
              type="button"
              onClick={() => { setLoginMethod('email'); setShowOtpField(false); }}
              className={`flex-1 py-3 text-[10px] uppercase tracking-[2px] transition-all rounded-sm ${loginMethod === 'email' ? 'bg-dark text-cream shadow-sm' : 'text-mauve/60 hover:text-mauve font-medium'}`}
            >
              Email Address
            </button>
            <button 
              type="button"
              onClick={() => { setLoginMethod('mobile'); }}
              className={`flex-1 py-3 text-[10px] uppercase tracking-[2px] transition-all rounded-sm ${loginMethod === 'mobile' ? 'bg-dark text-cream shadow-sm' : 'text-mauve/60 hover:text-mauve font-medium'}`}
            >
              Mobile Number
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              {loginMethod === 'email' ? (
                <div className="space-y-6">
                  <div className="space-y-2 group">
                    <label htmlFor="email" className="text-[10px] uppercase tracking-[3px] text-mauve/60 font-medium">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mauve/40 group-focus-within:text-gold transition-colors" />
                      <input 
                        id="email"
                        type="email" 
                        required
                        placeholder="sarah@rarewellness.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-label="Email Address"
                        className="w-full bg-linen/30 border-none p-5 pl-12 text-sm text-dark focus:ring-1 focus:ring-gold outline-none rounded-sm transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <div className="flex justify-between items-center">
                      <label htmlFor="password" className="text-[10px] uppercase tracking-[3px] text-mauve/60 font-medium">Password</label>
                      <button type="button" className="text-[9px] uppercase tracking-widest text-mauve/40 hover:text-gold transition-colors font-bold">Forgot Password?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mauve/40 group-focus-within:text-gold transition-colors" />
                      <input 
                        id="password"
                        type={showPassword ? 'text' : 'password'} 
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-label="Password"
                        className="w-full bg-linen/30 border-none p-5 pl-12 pr-12 text-sm text-dark focus:ring-1 focus:ring-gold outline-none rounded-sm transition-all" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-mauve/30 hover:text-dark transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2 group">
                    <label className="text-[10px] uppercase tracking-[3px] text-mauve/60 font-medium">Mobile Number</label>
                    <div className="flex gap-2">
                       <div className="relative inline-block">
                         <select className="bg-linen/30 px-4 py-5 text-sm text-mauve font-medium rounded-sm outline-none border-none cursor-pointer appearance-none pr-8">
                           <option value="+91">+91</option>
                           <option value="+1">+1</option>
                           <option value="+44">+44</option>
                           <option value="+971">+971</option>
                         </select>
                         <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-1 text-mauve/40 font-bold">▼</div>
                       </div>
                       <div className="relative flex-1">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mauve/40 transition-colors" />
                        <input 
                          type="tel" 
                          required
                          maxLength={10}
                          placeholder="98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-linen/30 border-none p-5 pl-12 text-sm text-dark focus:ring-1 focus:ring-gold outline-none rounded-sm transition-all" 
                        />
                      </div>
                    </div>
                  </div>

                  {showOtpField && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <label className="text-[10px] uppercase tracking-[3px] text-mauve/60 font-medium">Verification Code</label>
                      <div className="flex justify-between gap-2">
                        {otp.map((digit, i) => (
                          <input
                            key={i}
                            id={`otp-${i}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Backspace' && !otp[i] && i > 0) {
                                document.getElementById(`otp-${i - 1}`)?.focus()
                              }
                            }}
                            className="w-full aspect-square bg-linen/30 border-none text-center text-xl text-dark focus:ring-1 focus:ring-gold outline-none transition-all rounded-sm shadow-inner"
                          />
                        ))}
                      </div>
                      <p className="text-[9px] text-mauve/40 italic">Check your mobile for the 6-digit code.</p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 text-xs tracking-[4px] uppercase font-bold"
              isLoading={login.isPending || mobileLogin.isPending || sendOtp.isPending}
            >
              {loginMethod === 'mobile' && !showOtpField ? 'Send OTP' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-mauve text-xs">
            New to RARE? {' '}
            <Link to="/signup" className="text-gold font-medium hover:underline underline-offset-4">Join RARE</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
