import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingBag, User, Menu, X, Sparkles, LogOut } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { SearchOverlay } from '@/components/SearchOverlay'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Sanctuaries', to: '/services' },
  { label: 'The Edit', to: '/shop' },
  { label: 'Mishti', to: '/mishti', icon: <Sparkles className="w-3 h-3 text-gold" /> },
  { label: 'Journal', to: '/journal' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { totals } = useCart()
  const { isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const hideNav = ['/login', '/signup', '/register'].includes(pathname)
  if (hideNav) return null

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/80 backdrop-blur-md border-b border-dark/5 h-[72px]' : 'bg-transparent h-20'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full flex items-center justify-between h-full">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center group flex-shrink-0">
          <span className="font-playfair text-xl sm:text-2xl text-dark tracking-[0.3em] font-light transition-transform duration-500 group-hover:scale-105">
            R<span className="text-rose">A</span>RE<sup className="text-[10px] ml-0.5 text-gold">•</sup>
          </span>
        </Link>

        {/* Center: Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'relative text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 flex items-center gap-1.5',
                pathname === link.to ? 'text-gold' : 'text-dark/70 hover:text-dark'
              )}
            >
              {link.icon}
              {link.label}
              {pathname === link.to && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gold"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-3 sm:gap-6">
          <motion.button
            onClick={() => setSearchOpen(true)}
            animate={{ scale: searchOpen ? 1.1 : 1 }}
            className={cn(
              "transition-colors duration-300",
              searchOpen ? "text-gold" : "text-dark/70 hover:text-dark"
            )}
            aria-label="Open search"
          >
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </motion.button>

          <Link to="/cart" className="relative group">
            <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-dark/70 group-hover:text-dark transition-colors duration-300" />
            <AnimatePresence>
              {totals.itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-2 -right-2 bg-rose text-white text-[9px] min-w-[14px] h-[14px] sm:min-w-[16px] sm:h-[16px] rounded-full flex items-center justify-center font-medium"
                >
                  {totals.itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="text-dark/70 hover:text-dark transition-colors duration-300">
                <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </Link>
              <button 
                onClick={logout}
                className="text-dark/40 hover:text-rose transition-colors hidden sm:block"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-dark/70 hover:text-dark transition-colors duration-300">
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </Link>
          )}

          {!isAuthenticated && (
            <Link to="/signup" className="hidden sm:flex items-center gap-2 bg-rose hover:bg-rose/90 text-cream text-[9px] uppercase tracking-[0.2em] px-3 sm:px-5 py-2 sm:py-2.5 rounded-sm transition-all shadow-lg hover:shadow-rose/20 whitespace-nowrap">
              Join Us
            </Link>
          )}

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-dark/80"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-20 bg-dark z-40 md:hidden flex flex-col p-8 gap-8 border-t border-gold/10"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="text-xl font-playfair text-cream/90 flex items-center gap-3 border-b border-gold/5 pb-4"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay 
        open={searchOpen} 
        onClose={() => setSearchOpen(false)} 
      />
    </nav>
  )
}
