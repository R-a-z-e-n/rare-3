import type { Service } from '@/types'

export const SERVICES: Service[] = [
  { id: 1, name: 'Lume Wellness Spa', location: 'Beverly Hills, CA', address: '9876 Wilshire Blvd, Beverly Hills, CA 90210', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', tags: ['Massage', 'Facial'], price: '₹180', rating: 4.9, category: 'Spas' },
  { id: 2, name: 'Serenity Yoga Studio', location: 'Santa Monica, CA', address: '1250 Ocean Park Blvd, Santa Monica, CA 90405', image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80', tags: ['Yoga', 'Meditation'], price: '₹45', rating: 5.0, category: 'Yoga' },
  { id: 3, name: 'Atelier Beauty Lounge', location: 'West Hollywood, CA', address: '8720 Sunset Blvd, West Hollywood, CA 90069', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80', tags: ['Hair', 'Nails'], price: '₹95', rating: 4.8, category: 'Salons' },
  { id: 6, name: 'Zen Meditation Center', location: 'Culver City, CA', address: '9876 Venice Blvd, Culver City, CA 90232', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', tags: ['Zen', 'Mindfulness'], price: '₹30', rating: 5.0, category: 'Spas' },
]
