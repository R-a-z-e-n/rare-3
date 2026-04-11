import { createContext, useContext, useReducer, useCallback, useEffect, useMemo, type ReactNode } from 'react'
import { toast } from 'sonner'
import type { CartItem, Product } from '@/types'

// ── State ──────────────────────────────────────────────────────────────────────
interface CartState {
  items: CartItem[]
  loyaltyApplied: boolean
}

// ── Actions ────────────────────────────────────────────────────────────────────
type CartAction =
  | { type: 'ADD_ITEM';    payload: { product: Product; variation?: string } }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QTY';  payload: { id: number; delta: number } }
  | { type: 'TOGGLE_LOYALTY' }
  | { type: 'CLEAR_CART' }

// ── Reducer ────────────────────────────────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variation = '' } = action.payload
      const exists = state.items.find(i => i.id === product.id)
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...product, qty: 1, variation }],
      }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload.id) }

    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id
            ? { ...i, qty: Math.max(1, i.qty + action.payload.delta) }
            : i,
        ),
      }
    case 'TOGGLE_LOYALTY':
      return { ...state, loyaltyApplied: !state.loyaltyApplied }

    case 'CLEAR_CART':
      return { items: [], loyaltyApplied: false }

    default:
      return state
  }
}

// ── Derived helpers ────────────────────────────────────────────────────────────
function computeTotals(state: CartState) {
  const subtotal  = state.items.reduce((s, i) => s + i.price * i.qty, 0)
  const discount  = state.loyaltyApplied ? subtotal * 0.1 : 0
  const tax       = (subtotal - discount) * 0.0875
  const total     = subtotal - discount + tax
  const itemCount = state.items.reduce((s, i) => s + i.qty, 0)
  return { subtotal, discount, tax, total, itemCount }
}

// ── Context ────────────────────────────────────────────────────────────────────
interface CartContextValue {
  state: CartState
  totals: ReturnType<typeof computeTotals>
  addItem:       (product: Product, variation?: string) => void
  removeItem:    (id: number) => void
  updateQty:     (id: number, delta: number) => void
  toggleLoyalty: () => void
  clearCart:     () => void
}

const CartContext = createContext<CartContextValue | null>(null)

// ── Provider ───────────────────────────────────────────────────────────────────
const INITIAL_CART: CartState = {
  items: [
    {
      id: 1, brand: 'Tatcha', name: 'The Dewy Skin Cream', qty: 1,
      variation: '50ml', price: 68, category: 'Skincare', rating: 4.9,
      image: 'https://images.unsplash.com/photo-1763503839418-2b45c3d7a3c3?w=400&q=80',
    },
    {
      id: 2, brand: 'Glossier', name: 'Super Bounce Serum', qty: 2,
      variation: '30ml', price: 32, category: 'Skincare', rating: 4.7,
      image: 'https://images.unsplash.com/photo-1605619082574-e92eee603b95?w=400&q=80',
    },
  ],
  loyaltyApplied: false,
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, INITIAL_CART, (initial) => {
    const saved = localStorage.getItem('rare_cart_v2.3')
    return saved ? JSON.parse(saved) : initial
  })

  useEffect(() => {
    localStorage.setItem('rare_cart_v2.3', JSON.stringify(state))
  }, [state])

  const addItem       = useCallback((product: Product, variation = '') => {
    dispatch({ type: 'ADD_ITEM',    payload: { product, variation } })
    toast.success(`${product.name} added to your ritual`, {
      description: variation ? `Size: ${variation}` : undefined,
      action: {
        label: 'View Cart',
        onClick: () => window.location.href = '/cart'
      }
    })
  }, [])
  const removeItem    = useCallback((id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } })
    toast.info('Item removed from cart')
  }, [])
  const updateQty     = useCallback((id: number, delta: number) =>
    dispatch({ type: 'UPDATE_QTY',  payload: { id, delta } }), [])
  const toggleLoyalty = useCallback(() =>
    dispatch({ type: 'TOGGLE_LOYALTY' }), [])
  const clearCart     = useCallback(() =>
    dispatch({ type: 'CLEAR_CART' }), [])

  const value = useMemo(() => ({
    state,
    totals: computeTotals(state),
    addItem,
    removeItem,
    updateQty,
    toggleLoyalty,
    clearCart
  }), [state, addItem, removeItem, updateQty, toggleLoyalty, clearCart])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
