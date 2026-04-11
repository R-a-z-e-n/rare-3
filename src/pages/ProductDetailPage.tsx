import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronRight, Minus, Plus, ShoppingBag, ShieldCheck, Zap, Globe } from 'lucide-react'
import { Button, Tag, StarRating, OptimizedImage } from '@/components/ui'
import { ProductCard } from '@/components/shop/ProductCard'
import { useProduct, useProducts } from '@/hooks/useProducts'
import { useCart } from '@/context/CartContext'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addItem } = useCart()
  const { data: product, isLoading, isError } = useProduct(Number(id))
  const { data: allProducts = [] } = useProducts()
  
  const [qty, setQty] = useState(1)
  const [selectedSize, setSelectedSize] = useState('50ml')
  const [mainImage, setMainImage] = useState(0)

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  })

  if (isLoading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
    </div>
  )

  if (isError || !product) return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-6">
      <p className="font-playfair text-2xl text-dark italic">Product lost in the sanctuary.</p>
      <Link to="/shop"><Button>Back to Shop</Button></Link>
    </div>
  )

  const RECOMMENDED = allProducts.filter(p => p.id !== product.id).slice(0, 3)

  return (
    <div className="bg-cream min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-mauve mb-12">
          <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-dark/40">{product.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-dark">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          {/* Gallery */}
          <div className="space-y-6">
            <motion.div 
              layoutId="product-image"
              className="aspect-square bg-linen overflow-hidden"
            >
              <OptimizedImage 
                src={product.images[mainImage]} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </motion.div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setMainImage(i)}
                  className={`aspect-square bg-linen overflow-hidden border-2 transition-all ${mainImage === i ? 'border-gold' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <p className="text-gold text-xs uppercase tracking-[5px] font-medium mb-4">{product.brand}</p>
              <h1 className="font-playfair text-4xl md:text-5xl text-dark mb-6 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-6 mb-8">
                <StarRating rating={product.rating} />
                <span className="w-px h-4 bg-dark/10" />
                <p className="text-mauve text-sm uppercase tracking-widest">128 Reviews</p>
              </div>
              <p className="text-mauve text-lg font-light leading-relaxed mb-8">{product.description}</p>
            </div>

            <div className="space-y-12 mb-12">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-mauve mb-4">Select Size</label>
                <div className="flex gap-4">
                  {['15ml', '30ml'].map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-8 py-3 text-[11px] uppercase tracking-widest border transition-all ${
                        selectedSize === size ? 'bg-dark text-cream border-dark' : 'bg-transparent text-dark border-dark/10 hover:border-gold'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-linen/50 border border-dark/5">
                <div className="flex flex-col">
                  <p className="text-[10px] uppercase tracking-widest text-mauve mb-1">Price</p>
                  <p className="text-3xl font-playfair text-dark">₹{product.price * qty}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-cream border border-dark/10">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 text-mauve hover:text-dark"><Minus className="w-4 h-4" /></button>
                    <span className="w-8 text-center text-sm font-medium">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="p-3 text-mauve hover:text-dark"><Plus className="w-4 h-4" /></button>
                  </div>
                  <Button onClick={() => addItem(product, selectedSize)} className="px-12 h-[52px]">
                    <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                </div>
              </div>
            </div>

            {/* Icons */}
            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-dark/5">
              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="w-6 h-6 text-gold mb-3" />
                <p className="text-[10px] uppercase tracking-widest text-dark font-medium">Clean Certified</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Zap className="w-6 h-6 text-gold mb-3" />
                <p className="text-[10px] uppercase tracking-widest text-dark font-medium">Fast Shipping</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Globe className="w-6 h-6 text-gold mb-3" />
                <p className="text-[10px] uppercase tracking-widest text-dark font-medium">Fair Trade</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-32 border-t border-dark/10 pt-16">
          <div>
            <h4 className="font-playfair text-2xl text-dark mb-6 italic">Ingredients</h4>
            <p className="text-mauve text-sm leading-relaxed font-light">{product.ingredients}</p>
          </div>
          <div>
            <h4 className="font-playfair text-2xl text-dark mb-6 italic">How to Use</h4>
            <p className="text-mauve text-sm leading-relaxed font-light">{product.usage}</p>
          </div>
          <div>
            <h4 className="font-playfair text-2xl text-dark mb-6 italic">Sustainability</h4>
            <p className="text-mauve text-sm leading-relaxed font-light">
              Our packaging is 100% recyclable. We partner with Teracycle to ensure none of our components end up in landfills.
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="pt-24 border-t border-dark/10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <Tag label="Recommendations" variant="gold" className="mb-4" />
              <h2 className="font-playfair text-4xl text-dark italic">You May Also <em className="text-rose">Love</em></h2>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => emblaApi?.scrollPrev()}
                className="w-10 h-10 rounded-full border border-dark/10 flex items-center justify-center hover:bg-dark hover:text-cream transition-all"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <button 
                onClick={() => emblaApi?.scrollNext()}
                className="w-10 h-10 rounded-full border border-dark/10 flex items-center justify-center hover:bg-dark hover:text-cream transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-10">
              {RECOMMENDED.map(p => (
                <div key={p.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0">
                  <ProductCard product={p as any} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
