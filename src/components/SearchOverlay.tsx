import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '@/hooks/useSearch'
import { OptimizedImage } from '@/components/ui'
import { cn } from '@/lib/utils'

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

const EXPLORE_SUGGESTIONS = {
  sanctuaries: ['Lume Wellness Spa', 'Serenity Yoga Studio', 'Atelier Beauty Lounge', 'Harmony Massage', 'Tranquil Day Spa'],
  products: ['La Mer Concentrate', 'Tatcha Dewy Skin Cream', 'Byredo Gypsy Water', 'Olaplex No.3', 'Herbivore Pink Cloud'],
  journal: ['The Art of Slow Beauty', 'Wellness Retreats 2025', 'Guide to Clean Skincare', 'Mindful Morning Rituals']
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('rare_recent_searches') || '[]')
    setRecentSearches(recent)
  }, [open])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 150)
    return () => clearTimeout(timer)
  }, [query])

  const results = useSearch(debouncedQuery)
  const allResults = [...results.services, ...results.products, ...results.articles]

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      setQuery('')
      setHighlightedIndex(-1)
    }
  }, [open])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex(i => Math.min(i + 1, allResults.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex(i => Math.max(i - 1, -1))
      }
      if (e.key === 'Enter') {
        if (highlightedIndex >= 0) {
          handleResultClick(allResults[highlightedIndex])
        } else if (query.trim()) {
          saveRecentSearch(query.trim())
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, allResults, highlightedIndex, query])

  const saveRecentSearch = (q: string) => {
    const recent: string[] = JSON.parse(localStorage.getItem('rare_recent_searches') || '[]')
    const updated = [q, ...recent.filter(r => r !== q)].slice(0, 5)
    localStorage.setItem('rare_recent_searches', JSON.stringify(updated))
    setRecentSearches(updated)
  }

  const removeRecentSearch = (e: React.MouseEvent, q: string) => {
    e.stopPropagation()
    const updated = recentSearches.filter(r => r !== q)
    localStorage.setItem('rare_recent_searches', JSON.stringify(updated))
    setRecentSearches(updated)
  }

  const handleResultClick = (item: any) => {
    saveRecentSearch(query || item.name || item.title)
    if ('location' in item) navigate('/services')
    else if ('brand' in item) navigate(`/shop/${item.id}`)
    else navigate('/journal')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-dark/96 backdrop-blur-md flex flex-col pt-16"
        >
          {/* Top Bar */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="px-6 md:px-16 pb-6 border-b border-gold/30"
          >
            <div className="max-w-7xl mx-auto flex items-center gap-6">
              <div className="flex-1 relative flex items-center">
                <span className="text-gold/60 text-xl mr-4">✦</span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search sanctuaries, products, rituals..."
                  className="w-full bg-transparent border-none text-2xl md:text-4xl font-playfair text-cream font-light outline-none placeholder:text-cream/20 search-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && query !== debouncedQuery && (
                  <div className="absolute right-0 w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                )}
              </div>
              <button 
                onClick={onClose}
                className="text-cream/60 hover:text-cream transition-colors p-2"
              >
                <X className="w-8 h-8 font-light" />
              </button>
            </div>
          </motion.div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto px-6 md:px-16 py-12 search-results no-scrollbar">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                {!debouncedQuery ? (
                  <motion.div 
                    key="explore"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12"
                  >
                    {recentSearches.length > 0 && (
                      <div className="space-y-6">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-gold/60">Recent</p>
                        <div className="flex flex-col gap-3">
                          {recentSearches.map(q => (
                            <div 
                              key={q} 
                              onClick={() => setQuery(q)}
                              className="group flex items-center justify-between text-cream/50 text-xs hover:text-gold transition-colors cursor-pointer py-1"
                            >
                              <span>→ {q}</span>
                              <X 
                                className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" 
                                onClick={(e) => removeRecentSearch(e, q)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-6">
                      <p className="text-[9px] uppercase tracking-[0.3em] text-gold/60">Sanctuaries</p>
                      <div className="flex flex-col gap-3">
                        {EXPLORE_SUGGESTIONS.sanctuaries.map(s => (
                          <span key={s} onClick={() => setQuery(s)} className="text-cream/50 text-xs hover:text-gold transition-colors cursor-pointer py-1">→ {s}</span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <p className="text-[9px] uppercase tracking-[0.3em] text-gold/60">The Edit</p>
                      <div className="flex flex-col gap-3">
                        {EXPLORE_SUGGESTIONS.products.map(p => (
                          <span key={p} onClick={() => setQuery(p)} className="text-cream/50 text-xs hover:text-gold transition-colors cursor-pointer py-1">→ {p}</span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <p className="text-[9px] uppercase tracking-[0.3em] text-gold/60">Journal</p>
                      <div className="flex flex-col gap-3">
                        {EXPLORE_SUGGESTIONS.journal.map(j => (
                          <span key={j} onClick={() => setQuery(j)} className="text-cream/50 text-xs hover:text-gold transition-colors cursor-pointer py-1">→ {j}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : results.total > 0 ? (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-16"
                  >
                    {results.services.length > 0 && (
                      <section>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-gold/50 mb-8 flex items-center gap-3">
                          <span className="flex-1 h-px bg-gold/10" />
                          Sanctuaries
                          <span className="flex-1 h-px bg-gold/10" />
                        </p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {results.services.map((item, i) => (
                            <ResultItem 
                              key={item.id} 
                              item={item} 
                              index={i}
                              highlighted={i === highlightedIndex}
                              onClick={() => handleResultClick(item)} 
                            />
                          ))}
                        </div>
                      </section>
                    )}

                    {results.products.length > 0 && (
                      <section>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-gold/50 mb-8 flex items-center gap-3">
                          <span className="flex-1 h-px bg-gold/10" />
                          The Edit
                          <span className="flex-1 h-px bg-gold/10" />
                        </p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {results.products.map((item, i) => (
                            <ResultItem 
                              key={item.id} 
                              item={item} 
                              index={i + results.services.length}
                              highlighted={(i + results.services.length) === highlightedIndex}
                              onClick={() => handleResultClick(item)} 
                            />
                          ))}
                        </div>
                      </section>
                    )}

                    {results.articles.length > 0 && (
                      <section>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-gold/50 mb-8 flex items-center gap-3">
                          <span className="flex-1 h-px bg-gold/10" />
                          Journal
                          <span className="flex-1 h-px bg-gold/10" />
                        </p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {results.articles.map((item, i) => (
                            <ResultItem 
                              key={item.id} 
                              item={item} 
                              index={i + results.services.length + results.products.length}
                              highlighted={(i + results.services.length + results.products.length) === highlightedIndex}
                              onClick={() => handleResultClick(item)} 
                            />
                          ))}
                        </div>
                      </section>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="no-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                  >
                    <p className="font-playfair text-4xl text-cream/20 font-light mb-4 text-center">
                      No results found
                    </p>
                    <p className="text-muted text-sm text-center">
                      Try "spa", "skincare", "yoga", or "serenity"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="px-6 md:px-16 py-4 border-t border-cream/5 flex justify-center md:justify-start">
            <div className="flex items-center gap-8 text-[9px] md:text-[10px] text-cream/20 uppercase tracking-[0.2em]">
              <span className="flex items-center gap-1.5"><span className="border border-cream/10 px-1 rounded-[2px]">↵</span> to select</span>
              <span className="flex items-center gap-1.5"><span className="border border-cream/10 px-1 rounded-[2px]">↑↓</span> to navigate</span>
              <span className="flex items-center gap-1.5"><span className="border border-cream/10 px-1 rounded-[2px]">ESC</span> to close</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ResultItem({ item, index, highlighted, onClick }: { item: any, index: number, highlighted: boolean, onClick: () => void }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.2 } })
      }}
      initial="hidden"
      animate="visible"
      custom={index}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-6 p-4 transition-all duration-300 cursor-pointer border-l-2 border-transparent",
        highlighted ? "bg-cream/10 border-gold shadow-lg" : "hover:bg-cream/5"
      )}
    >
      <div className="w-16 h-16 flex-shrink-0 bg-linen overflow-hidden">
        <OptimizedImage src={item.image} alt={item.name || item.title} className="w-full h-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-playfair text-cream text-base mb-1 truncate group-hover:text-gold transition-colors">
          {item.name || item.title}
        </h4>
        <div className="flex items-center gap-3">
          <p className="text-muted text-[11px] truncate">
            {'brand' in item ? `${item.brand} \u00B7 ${item.category}` : 
             'location' in item ? `${item.location} \u00B7 ${item.category}` : 
             `${item.category} \u00B7 ${item.readTime}`}
             {'price' in item && ` \u00B7 ₹${item.price}`}
          </p>
          {'rating' in item && (
            <span className="text-gold text-[10px] flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-gold" /> {item.rating}
            </span>
          )}
          {'match' in item && item.match > 0 && (
            <span className="bg-rose/10 text-rose text-[9px] px-2 py-0.5 rounded-full border border-rose/10 uppercase tracking-tighter">
              {item.match}% Match
            </span>
          )}
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-gold/0 group-hover:text-gold transition-all duration-300 group-hover:translate-x-1" />
    </motion.div>
  )
}
