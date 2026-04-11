import { useMutation } from '@tanstack/react-query'
import { api } from '@/api'

export function useBooking() {
  return useMutation({
    mutationFn: (data: any) => api.bookings.create(data)
  })
}
