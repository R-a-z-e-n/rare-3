import { useMutation } from '@tanstack/react-query'
import { api } from '@/api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import { User } from '@/types'
import { AxiosError } from 'axios'

interface ApiError {
  message: string
}

export function useLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()

  return useMutation<User & { token: string }, AxiosError<ApiError>, any>({
    mutationFn: api.auth.login,
    onSuccess: (data) => {
      toast.success(`Welcome back, ${data.name}`)
      login(data)
      navigate('/dashboard')
    },
    onError: (error: AxiosError<ApiError>) => {
      const msg = error.response?.data?.message || 'Login failed'
      toast.error(msg)
    }
  })
}

export function useSignup() {
  const navigate = useNavigate()
  const { login } = useAuth()

  return useMutation<User & { token: string }, AxiosError<ApiError>, any>({
    mutationFn: api.auth.signup,
    onSuccess: (data) => {
      toast.success('Membership created successfully')
      login(data)
      navigate('/dashboard')
    },
    onError: (error: AxiosError<any>) => {
      const data = error.response?.data
      if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        toast.error(`Validation Error: ${data.errors[0].message}`)
      } else {
        const msg = data?.message || 'The ritual could not be initiated'
        toast.error(msg)
      }
    }
  })
}

export function useMobileLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()

  return useMutation<User & { token: string }, AxiosError<any>, { phone: string; otp: string }>({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) => api.auth.loginWithMobile(phone, otp),
    onSuccess: (data) => {
      toast.success(`Welcome back, ${data.name}`)
      login(data)
      navigate('/dashboard')
    },
    onError: (error: AxiosError<any>) => {
      const data = error.response?.data
      if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        toast.error(`Validation Error: ${data.errors[0].message}`)
      } else {
        const msg = data?.message || 'Mobile login failed'
        toast.error(msg)
      }
    }
  })
}

export function useSendOtp() {
  return useMutation<{ message: string; fallback?: boolean }, AxiosError<any>, string>({
    mutationFn: (phone: string) => api.auth.sendOtp(phone),
    onSuccess: (data) => {
      if (data.fallback) {
        toast.info('Credential missing: Check console for OTP')
      } else {
        toast.success('Verification code sent')
      }
    },
    onError: (error: AxiosError<any>) => {
      const data = error.response?.data
      if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        toast.error(`Validation Error: ${data.errors[0].message}`)
      } else {
        const msg = data?.message || 'Failed to send OTP'
        toast.error(msg)
      }
    }
  })
}
