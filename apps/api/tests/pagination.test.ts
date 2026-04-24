import { describe, it, expect, beforeEach } from 'bun:test'

function getPaginationState(page: number, totalPages: number) {
  const currentPage =
    page > totalPages ? totalPages : page < 1 ? 1 : page

  return {
    currentPage,
    isFirst: currentPage === 1,
    isLast: currentPage === totalPages,
  }
}

function buildUrl(page: number) {
  return `/products?page=${page}`
}

describe('Pagination - catalog behavior', () => {
  let totalPages: number

  beforeEach(() => {
    totalPages = 5
  })

  // 🟢 1 сторінка
  it('should disable previous button on first page', () => {
    const state = getPaginationState(1, totalPages)

    expect(state.isFirst).toBe(true)
    expect(state.isLast).toBe(false)
  })

  // 🟢 Остання сторінка
  it('should disable next button on last page', () => {
    const state = getPaginationState(5, totalPages)

    expect(state.isLast).toBe(true)
    expect(state.isFirst).toBe(false)
  })

  // 🟢 ОНОВЛЕННЯ URL-адреси
  it('should update URL when page changes', () => {
    const url = buildUrl(3)

    expect(url).toBe('/products?page=3')
  })

  // 🔴 Сторінка занадто велика
  it('should normalize page if page exceeds total pages', () => {
    const state = getPaginationState(999, totalPages)

    expect(state.currentPage).toBe(5)
    expect(state.isLast).toBe(true)
  })

  // 🔴 Сторінка занадто маленька
  it('should normalize page if page is less than 1', () => {
    const state = getPaginationState(0, totalPages)

    expect(state.currentPage).toBe(1)
    expect(state.isFirst).toBe(true)
  })
})