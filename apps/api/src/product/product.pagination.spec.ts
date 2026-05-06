import { describe, it, expect, beforeEach, mock } from 'bun:test'

describe('Product pagination', () => {
  let prismaMock: Record<string, unknown>
let service: Record<string, unknown>

  beforeEach(() => {
    prismaMock = {
      product: {
        findMany: mock(),
      },
    }

    service = {
      getAllProducts: async (query: { page: number; limit: number }) => {
        const page = Math.max(query.page, 1)
        const skip = (page - 1) * query.limit

        return prismaMock.product.findMany({
          skip,
          take: query.limit,
        })
      },
    }
  })

  it('повертає продукти з пагінацією', async () => {
    prismaMock.product.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }])

    const result = await service.getAllProducts({ page: 1, limit: 10 })

    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
    })

    expect(result).toHaveLength(2)
  })

  it('правильно рахує skip', async () => {
    prismaMock.product.findMany.mockResolvedValue([])

    await service.getAllProducts({ page: 3, limit: 10 })

    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      skip: 20,
      take: 10,
    })
  })

  it('не дає негативний page', async () => {
    prismaMock.product.findMany.mockResolvedValue([])

    await service.getAllProducts({ page: -5, limit: 10 })

    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
    })
  })
})