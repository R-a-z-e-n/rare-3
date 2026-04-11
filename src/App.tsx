import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/ui'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

// ── Lazy Pages ──────────────────────────────────────────────────────────────────
const HomePage          = lazy(() => import('@/pages/HomePage'))
const ServicesPage      = lazy(() => import('@/pages/ServicesPage'))
const ShopPage          = lazy(() => import('@/pages/ShopPage'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const MishtiPage        = lazy(() => import('@/pages/MishtiPage'))
const JournalPage       = lazy(() => import('@/pages/JournalPage'))
const DashboardPage     = lazy(() => import('@/pages/DashboardPage'))
const CartPage          = lazy(() => import('@/pages/CartPage'))
const CheckoutPage      = lazy(() => import('@/pages/CheckoutPage'))
const LoginPage         = lazy(() => import('@/pages/LoginPage'))
const SignupPage        = lazy(() => import('@/pages/RegisterPage'))
const PartnerPage       = lazy(() => import('@/pages/PartnerPage'))
const NotFoundPage      = lazy(() => import('@/pages/NotFoundPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30,    // 30 minutes
    },
  },
})

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
    </div>
  )
}

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-dark">
      <CustomCursor />
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'shop/:id', element: <ProductDetailPage /> },
      { path: 'mishti', element: <MishtiPage /> },
      { path: 'journal', element: <JournalPage /> },
      { path: 'cart', element: <CartPage /> },
      { 
        path: 'dashboard', 
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'checkout', 
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ) 
      },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'partner', element: <PartnerPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <CartProvider>
            <RouterProvider router={router} />
            <Toaster position="top-center" richColors />
          </CartProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
