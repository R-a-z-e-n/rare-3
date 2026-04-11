import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach JWT token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rare_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Handle errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('rare_user')
      localStorage.removeItem('rare_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
