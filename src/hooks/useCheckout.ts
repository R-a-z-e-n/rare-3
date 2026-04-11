import { useMutation } from '@tanstack/react-query'
import { api } from '@/api'

export function useCheckout() {
  return useMutation({
    mutationFn: (data: any) => (api as any).orders.checkout(data)
  })
}
