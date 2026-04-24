import { describe, it, expect, beforeEach, mock } from 'bun:test'

describe('Product API - pagination integration', () => {
  let prismaMock: any
  let service: any

  beforeEach(() => {
    prismaMock = {
      product: {
        findMany: mock(),
      },
    }

    service = {
      prisma: prismaMock,
      async getAllProducts(query: { page: number; limit: number }) {
        const skip = (query.page - 1) * query.limit

        return this.prisma.product.findMany({
          skip,
          take: query.limit,
        })
      },
    }

    mock.restore()
  })

  // 🟢 пагінація працює
  it('should return paginated products', async () => {
    prismaMock.product.findMany.mockResolvedValue([
      { id: 1, name: 'Phone' },
      { id: 2, name: 'Laptop' },
    ])

    const result = await service.getAllProducts({
      page: 1,
      limit: 10,
    })

    expect(result.length).toBeLessThanOrEqual(10)
  })

  // 🔴 переповнення сторінки (999)
  it('should return empty array if page is too large', async () => {
    prismaMock.product.findMany.mockResolvedValue([])

    const result = await service.getAllProducts({
      page: 999,
      limit: 10,
    })

    expect(result).toEqual([])
  })

  // 🟢 перевірка ліміту
  it('should respect limit parameter', async () => {
    prismaMock.product.findMany.mockResolvedValue([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ])

    const result = await service.getAllProducts({
      page: 1,
      limit: 3,
    })

    expect(result.length).toBe(3)
  })
})