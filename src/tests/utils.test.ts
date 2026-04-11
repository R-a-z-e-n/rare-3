import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn', () => {
  it('merges class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional falsy values', () => {
    expect(cn('foo', false && 'bar', undefined, null, 'baz')).toBe('foo baz')
  })

  it('deduplicates conflicting Tailwind classes (last wins)', () => {
    const result = cn('bg-red-500', 'bg-blue-500')
    expect(result).toBe('bg-blue-500')
    expect(result).not.toMatch(/bg-red-500/)
  })

  it('handles clsx object syntax', () => {
    expect(cn({ 'text-sm': true, 'text-lg': false })).toBe('text-sm')
  })

  it('handles clsx array syntax', () => {
    expect(cn(['p-2', 'mt-4'])).toBe('p-2 mt-4')
  })

  it('returns empty string for all falsy inputs', () => {
    expect(cn(false, undefined, null)).toBe('')
  })
})
