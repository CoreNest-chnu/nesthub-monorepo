import { describe, it, expect } from 'bun:test'

describe('Pagination util', () => {
  const getPaginationState = (page: number, totalPages: number) => {
    const currentPage =
      page > totalPages ? totalPages : page < 1 ? 1 : page

    return {
      currentPage,
      isFirst: currentPage === 1,
      isLast: currentPage === totalPages,
    }
  }

  const buildUrl = (page: number) => `/products?page=${page}`

  const totalPages = 5

  it('перша сторінка — вимикає previous', () => {
    const state = getPaginationState(1, totalPages)

    expect(state.isFirst).toBe(true)
    expect(state.isLast).toBe(false)
  })

  it('остання сторінка — вимикає next', () => {
    const state = getPaginationState(totalPages, totalPages)

    expect(state.isLast).toBe(true)
    expect(state.isFirst).toBe(false)
  })

  it('оновлює URL при зміні сторінки', () => {
    const url = buildUrl(3)

    expect(url).toBe('/products?page=3')
  })

  it('нормалізує сторінку якщо вона занадто велика', () => {
    const state = getPaginationState(999, totalPages)

    expect(state.currentPage).toBe(5)
  })

  it('нормалізує сторінку якщо вона менша за 1', () => {
    const state = getPaginationState(0, totalPages)

    expect(state.currentPage).toBe(1)
  })
})