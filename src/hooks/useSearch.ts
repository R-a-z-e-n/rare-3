import { useMemo } from 'react'
import type { Service, Product, Article } from '@/types'
import { SERVICES } from '@/data/services'
import { PRODUCTS } from '@/data/products'  
import { ARTICLES } from '@/data/articles'

export interface SearchResults {
  services: Service[]
  products: Product[]
  articles: Article[]
  total: number
}

export function useSearch(query: string): SearchResults {
  return useMemo(() => {
    if (!query.trim() || query.length < 2) {
      return { services: [], products: [], articles: [], total: 0 }
    }

    const q = query.toLowerCase().trim()

    const services = SERVICES.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 3)

    const products = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 3)

    const articles = ARTICLES.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q)
    ).slice(0, 3)

    return {
      services,
      products,
      articles,
      total: services.length + products.length + articles.length
    }
  }, [query])
}
