import type { Product, Service, User, LoginCredentials, SignupCredentials } from '@/types'

// Helper for simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockApi = {
  products: {
    list: async (): Promise<Product[]> => {
      await delay(800)
      return [
        { id: 1, brand: 'Aesop', name: 'Resurrection Hand Balm', image: 'https://images.unsplash.com/photo-1643379850623-7eb6442cd262?w=600&q=80', price: 28, category: 'Body', rating: 4.8 },
        { id: 2, brand: 'Tatcha', name: 'The Dewy Skin Cream', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80', price: 68, category: 'Skincare', rating: 4.9 },
        { id: 3, brand: 'La Mer', name: 'The Concentrate', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80', price: 450, category: 'Skincare', rating: 5.0 },
        { id: 4, brand: 'Byredo', name: 'Gypsy Water EDP', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80', price: 180, category: 'Fragrance', rating: 4.7 },
        { id: 5, brand: 'Augustinus Bader', name: 'The Rich Cream', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80', price: 290, category: 'Skincare', rating: 4.8 },
        { id: 6, brand: 'Jo Malone', name: 'Peony Blush Suede', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80', price: 155, category: 'Fragrance', rating: 4.9 },
        { id: 7, brand: 'Diptyque', name: 'Baies Scented Candle', image: 'https://images.unsplash.com/photo-1605619082574-e92eee603b95?w=600&q=80', price: 85, category: 'Wellness', rating: 4.8 },
        { id: 8, brand: 'Le Labo', name: 'Santal 33', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80', price: 215, category: 'Fragrance', rating: 5.0 },
      ] as Product[]
    },
    get: async (id: number): Promise<Product & { ingredients: string; usage: string; images: string[]; description: string }> => {
      await delay(500)
      const list = await mockApi.products.list()
      const product = list.find(p => p.id === id) || list[0]
      return {
        ...product,
        images: [
          product.image,
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
        ],
        description: 'A rich, moisturizing cream with plumping hydration and antioxidant-packed Japanese purple rice for a dewy, healthy glow. Ideal for dry skin, but can be used on normal skin for those who prefer a richer texture.',
        ingredients: 'Aqua/Water/Eau, Saccharomyces/Camellia Sinensis Leaf/Cladosiphon Okamuranus/Rice Ferment Filtrate, Glycerin, Rice Germ Oil...',
        usage: 'Scoop a pearl-sized amount of cream with the gold spoon. Massage onto face, neck, and décolletage in upward strokes. Use daily, morning and night.'
      }
    }
  },

  services: {
    list: async (): Promise<Service[]> => {
      await delay(1000)
      return [
        { id: 1, name: 'Lume Wellness Spa', location: 'Beverly Hills, CA', address: '9876 Wilshire Blvd, Beverly Hills, CA 90210', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', tags: ['Massage', 'Facial'], price: '₹180', rating: 4.9, category: 'Spa' },
        { id: 2, name: 'Serenity Yoga Studio', location: 'Santa Monica, CA', address: '1250 Ocean Park Blvd, Santa Monica, CA 90405', image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80', tags: ['Yoga', 'Meditation'], price: '₹45', rating: 5.0, category: 'Yoga' },
        { id: 3, name: 'Atelier Beauty Lounge', location: 'West Hollywood, CA', address: '8720 Sunset Blvd, West Hollywood, CA 90069', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80', tags: ['Hair', 'Nails'], price: '₹95', rating: 4.8, category: 'Spa' },
        { id: 6, name: 'Zen Meditation Center', location: 'Culver City, CA', address: '9876 Venice Blvd, Culver City, CA 90232', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', tags: ['Zen', 'Mindfulness'], price: '₹30', rating: 5.0, category: 'Meditations' },
      ] as Service[]
    }
  },

  auth: {
    login: async (credentials: LoginCredentials): Promise<User> => {
      await delay(1500)
      if (credentials.email === 'error@rare.com') throw new Error('Invalid credentials')
      return {
        id: 'u1',
        name: 'Julianne Moore',
        email: credentials.email,
        membership: 'Elite',
        points: 2450
      }
    },
    loginWithMobile: async (phone: string, otp: string): Promise<User> => {
      await delay(1500)
      if (otp !== '123456') throw new Error('Invalid OTP')
      return {
        id: 'u3',
        name: 'Mobile User',
        email: `${phone}@rare-mobile.com`,
        membership: 'Classic',
        points: 50
      }
    },
    signup: async (credentials: SignupCredentials): Promise<User> => {
      await delay(2000)
      return {
        id: 'u2',
        name: credentials.name,
        email: credentials.email,
        membership: 'Classic',
        points: 0
      }
    }
  },
  orders: {
    checkout: async (data: any): Promise<{ success: boolean; orderId: string }> => {
      console.log('Processing order for:', data.email)
      await delay(1500)
      return { success: true, orderId: `ORD-${Math.floor(Math.random() * 10000)}` }
    }
  },
  bookings: {
    create: async (data: any): Promise<{ success: boolean }> => {
      console.log('Booking created:', data)
      await delay(1200)
      return { success: true }
    }
  }
}
