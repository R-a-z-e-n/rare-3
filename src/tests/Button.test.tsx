import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Go</Button>)
    await userEvent.click(screen.getByText('Go'))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('applies dark variant classes by default', () => {
    render(<Button>Default</Button>)
    const btn = screen.getByText('Default')
    expect(btn.className).toMatch(/bg-dark/)
    expect(btn.className).toMatch(/text-cream/)
  })

  it('applies outline variant classes', () => {
    render(<Button variant="outline">Outline</Button>)
    const btn = screen.getByText('Outline')
    expect(btn.className).toMatch(/bg-transparent/)
    expect(btn.className).toMatch(/text-dark/)
  })

  it('applies gold variant classes', () => {
    render(<Button variant="gold">Gold</Button>)
    const btn = screen.getByText('Gold')
    expect(btn.className).toMatch(/text-gold/)
  })

  it('merges custom className', () => {
    render(<Button className="w-full">Full</Button>)
    expect(screen.getByText('Full').className).toMatch(/w-full/)
  })

  it('forwards disabled prop', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByText('Disabled')).toBeDisabled()
  })
})
