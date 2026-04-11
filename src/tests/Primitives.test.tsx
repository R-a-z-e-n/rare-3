import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Tag, StarRating, SectionLabel } from '@/components/ui/Primitives'

describe('Tag', () => {
  it('renders its children', () => {
    render(<Tag>Skincare</Tag>)
    expect(screen.getByText('Skincare')).toBeInTheDocument()
  })

  it('applies rose colour class', () => {
    render(<Tag>Test</Tag>)
    expect(screen.getByText('Test').className).toMatch(/text-rose/)
  })
})

describe('StarRating', () => {
  it('displays the rating value', () => {
    render(<StarRating rating={4.8} />)
    expect(screen.getByText(/4\.8/)).toBeInTheDocument()
  })

  it('shows the star symbol', () => {
    render(<StarRating rating={5.0} />)
    expect(screen.getByText(/★/)).toBeInTheDocument()
  })
})

describe('SectionLabel', () => {
  it('renders text', () => {
    render(<SectionLabel text="Featured" />)
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('applies gold colour by default', () => {
    render(<SectionLabel text="Default" />)
    expect(screen.getByText('Default').className).toMatch(/text-gold/)
  })

  it('applies light gold colour when light=true', () => {
    render(<SectionLabel text="Light" light />)
    expect(screen.getByText('Light').className).toMatch(/text-gold\/60/)
  })
})
