import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '@/context/CartContext'
import type { Product } from '@/types'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

const mockProduct: Product = {
  id: 99, brand: 'Test Brand', name: 'Test Product',
  image: '', price: 50, category: 'Skincare', rating: 4.5,
}

describe('CartContext', () => {
  it('initialises with seeded items', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    expect(result.current.state.items.length).toBeGreaterThan(0)
  })

  it('adds a new item', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    const before = result.current.state.items.length

    act(() => { result.current.addItem(mockProduct, '30ml') })

    expect(result.current.state.items.length).toBe(before + 1)
    const added = result.current.state.items.find(i => i.id === 99)
    expect(added).toBeDefined()
    expect(added?.qty).toBe(1)
    expect(added?.variation).toBe('30ml')
  })

  it('increments qty when adding existing item', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => { result.current.addItem(mockProduct) })
    act(() => { result.current.addItem(mockProduct) })
    const item = result.current.state.items.find(i => i.id === 99)
    expect(item?.qty).toBe(2)
  })

  it('removes an item', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => { result.current.addItem(mockProduct) })
    act(() => { result.current.removeItem(99) })
    expect(result.current.state.items.find(i => i.id === 99)).toBeUndefined()
  })

  it('updates qty with delta', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => { result.current.addItem(mockProduct) })
    act(() => { result.current.updateQty(99, 3) })
    expect(result.current.state.items.find(i => i.id === 99)?.qty).toBe(4)
  })

  it('qty never goes below 1', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => { result.current.addItem(mockProduct) })
    act(() => { result.current.updateQty(99, -99) })
    expect(result.current.state.items.find(i => i.id === 99)?.qty).toBe(1)
  })

  it('toggles loyalty and recomputes totals', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    const subtotalBefore = result.current.totals.subtotal
    expect(result.current.totals.discount).toBe(0)

    act(() => { result.current.toggleLoyalty() })

    expect(result.current.state.loyaltyApplied).toBe(true)
    expect(result.current.totals.discount).toBeCloseTo(subtotalBefore * 0.1)
    expect(result.current.totals.total).toBeLessThan(result.current.totals.subtotal + result.current.totals.tax + 1)
  })

  it('clears the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => { result.current.clearCart() })
    expect(result.current.state.items).toHaveLength(0)
    expect(result.current.totals.total).toBeCloseTo(0)
  })

  it('itemCount sums quantities', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => { result.current.clearCart() })
    act(() => { result.current.addItem(mockProduct) })
    act(() => { result.current.updateQty(99, 2) })
    expect(result.current.totals.itemCount).toBe(3)
  })
})
