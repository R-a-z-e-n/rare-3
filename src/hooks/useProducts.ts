import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ['products', category],
    queryFn: () => api.products.list(category),
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => api.products.get(id),
    enabled: !!id,
  })
}
