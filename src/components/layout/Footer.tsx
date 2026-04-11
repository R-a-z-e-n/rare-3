import { Link } from 'react-router-dom'
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Sanctuaries', to: '/services' },
  { label: 'List Your Space', to: '/partner' },
  { label: 'The Edit', to: '/shop' },
  { label: 'Journal', to: '/journal' },
  { label: 'Skin Analysis', to: '/mishti' },
]

const SERVICES = [
  { label: 'Spa Treatments', to: '/services' },
  { label: 'Wellness Retreats', to: '/services' },
  { label: 'Skin Consultation', to: '/mishti' },
  { label: 'Gift Cards', to: '/shop' },
]

const SOCIALS = [
  { icon: <Instagram className="w-5 h-5" />, href: '#' },
  { icon: <Twitter className="w-5 h-5" />, href: '#' },
  { icon: <Facebook className="w-5 h-5" />, href: '#' },
  { icon: <Youtube className="w-5 h-5" />, href: '#' },
]

export function Footer() {
  return (
    <footer className="bg-dark text-cream pt-20 pb-10 border-t border-gold/15 mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-center md:text-left">
          {/* Brand Blurb */}
          <div className="flex flex-col items-center md:items-start space-y-6">
            <Link to="/" className="inline-block transition-transform duration-500 hover:scale-105">
              <span className="font-playfair text-3xl text-gold tracking-[0.3em] font-light">
                R<span className="text-rose">A</span>RE<sup className="text-xs ml-0.5">•</sup>
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-xs font-light">
              A luxury wellness destination dedicated to the art of self-care. 
              Discover curated treatments and botanical essentials designed to 
              rejuvenate your mind, body, and spirit.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-playfair text-lg text-rose mb-6 tracking-wide">Quick Links</h4>
            <ul className="space-y-4">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-muted hover:text-gold transition-colors text-sm font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-playfair text-lg text-rose mb-6 tracking-wide">Services</h4>
            <ul className="space-y-4">
              {SERVICES.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-muted hover:text-gold transition-colors text-sm font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-playfair text-lg text-rose mb-6 tracking-wide">Connect</h4>
            <p className="text-muted text-sm mb-6 font-light max-w-[200px]">
              Follow our journey for wellness inspiration and exclusive updates.
            </p>
            <div className="flex gap-4">
              {SOCIALS.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-dark transition-all duration-500"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted/60 text-[10px] tracking-wider uppercase font-light">
            © {new Date().getFullYear()} RARE WELLNESS. ALL RIGHTS RESERVED.
          </p>
          <p className="text-gold/60 text-[10px] tracking-[0.2em] uppercase italic font-medium">
            Crafted with care • RARE v2.3
          </p>
        </div>
      </div>
    </footer>
  )
}
