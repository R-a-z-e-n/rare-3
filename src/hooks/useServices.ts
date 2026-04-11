import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'

export function useServices(category?: string) {
  return useQuery({
    queryKey: ['services', category],
    queryFn: () => api.services.list(category),
  })
}
