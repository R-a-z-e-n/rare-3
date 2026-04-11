import client from './client'
import { User, Product, Service, Booking, WishlistItem } from '../types'

export const realApi = {
  auth: {
    signup: async (data: any): Promise<User & { token: string }> => {
      const response = await client.post('/auth/signup', data)
      return response.data
    },
    login: async (data: any): Promise<User & { token: string }> => {
      const response = await client.post('/auth/login', data)
      return response.data
    },
    sendOtp: async (phone: string): Promise<{ message: string }> => {
      const response = await client.post('/auth/send-otp', { phone })
      return response.data
    },
    loginWithMobile: async (phone: string, otp: string): Promise<User & { token: string }> => {
      const response = await client.post('/auth/phone-login', { phone })
      return response.data
    },
  },
  products: {
    list: async (category?: string): Promise<Product[]> => {
      const response = await client.get('/products', { params: { category } })
      return response.data
    },
    getById: async (id: number): Promise<Product> => {
      const response = await client.get(`/products/${id}`)
      return response.data
    },
  },
  services: {
    list: async (category?: string): Promise<Service[]> => {
      const response = await client.get('/services', { params: { category } })
      return response.data
    },
    getById: async (id: number): Promise<Service> => {
      const response = await client.get(`/services/${id}`)
      return response.data
    },
  },
  bookings: {
    list: async (): Promise<Booking[]> => {
      const response = await client.get('/bookings')
      return response.data
    },
    create: async (data: Partial<Booking>): Promise<Booking> => {
      const response = await client.post('/bookings', data)
      return response.data
    },
  },
  wishlist: {
    list: async (): Promise<WishlistItem[]> => {
      const response = await client.get('/wishlist')
      return response.data
    },
    add: async (productId: number): Promise<WishlistItem> => {
      const response = await client.post('/wishlist', { productId })
      return response.data
    },
    remove: async (productId: number): Promise<void> => {
      await client.delete(`/wishlist/${productId}`)
    },
  },
}
