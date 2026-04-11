// ── Product ────────────────────────────────────────────────────────────────────
export interface Product {
  id: number
  brand: string
  name: string
  image: string
  price: number
  category: string
  rating: number
  /** AI skin-match percentage (0 = no match data) */
  match?: number
  badge?: string
}

// ── Cart ───────────────────────────────────────────────────────────────────────
export interface CartItem extends Product {
  qty: number
  variation: string
}

// ── Service / Destination ─────────────────────────────────────────────────────
export interface Service {
  id: number
  name: string
  location: string
  address: string
  image: string
  tags: string[]
  price: string
  rating: number
  category: ServiceCategory
}

export type ServiceCategory = 'All' | 'Salons' | 'Spas' | 'Yoga' | 'Massage'

// ── Destination (home page cards) ─────────────────────────────────────────────
export interface Destination {
  id: number
  name: string
  location: string
  image: string
  rating: number
}

// ── Testimonial ────────────────────────────────────────────────────────────────
export interface Testimonial {
  text: string
  author: string
  service: string
}

// ── Journal Article ────────────────────────────────────────────────────────────
export interface Article {
  id: number
  title: string
  category: string
  excerpt: string
  image: string
  readTime: string
}

// ── Booking ────────────────────────────────────────────────────────────────────
export interface Booking {
  service: string
  type: string
  date: string
  status: 'Upcoming' | 'Completed'
}

// ── Order ─────────────────────────────────────────────────────────────────────
export interface Order {
  id: string
  date: string
  total: string
  status: string
  items: number
}

// ── Mishti analysis step ──────────────────────────────────────────────────────
export type AnalysisStep = 'intro' | 'upload' | 'loading' | 'results'

// ── Sort option ────────────────────────────────────────────────────────────────
export type SortOption = 'Featured' | 'Price: Low' | 'Price: High' | 'Rating'

// ── Auth ───────────────────────────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  phone_number?: string
  membership: string
  points: number
}

export interface LoginCredentials {
  email: string
  password?: string
}

export interface SignupCredentials {
  name: string
  email: string
  password?: string
}
