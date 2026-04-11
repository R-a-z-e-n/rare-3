import { realApi } from './realApi'
import { mockApi } from './mockApi'

// Set this to true to use mock data for testing UI without the backend server
const USE_MOCK = false

export const api = USE_MOCK ? mockApi : (realApi as any)
