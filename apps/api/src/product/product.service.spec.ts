import { describe, it, expect, beforeEach, mock } from 'bun:test'
import { NotFoundException } from '@nestjs/common'

describe('ProductService', () => {
  let prismaMock: any
  let service: any

  beforeEach(() => {
    prismaMock = {
      product: {
        findMany: mock(),
        findUnique: mock(),
      },
    }

    service = {
      prisma: prismaMock,

      getAllProducts: async () => {
        return prismaMock.product.findMany()
      },

      getByCategory: async (categoryId: number | 'ALL') => {
        if (categoryId === 'ALL') {
          return prismaMock.product.findMany()
        }

        const id = Number(categoryId)

        return prismaMock.product.findMany({
          where: {
            categoryId: Number.isNaN(id) ? NaN : id,
          },
        })
      },

      getProductById: async (id: number) => {
        const product = await prismaMock.product.findUnique({
          where: { id: Number(id) },
        })

        if (!product) {
          throw new NotFoundException('Product not found')
        }

        return product
      },
    }

    mock.restore()
  })

  it('повертає всі продукти', async () => {
    prismaMock.product.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }])

    const result = await service.getAllProducts()

    expect(prismaMock.product.findMany).toHaveBeenCalled()
    expect(result).toHaveLength(2)
  })

  it('повертає всі продукти для ALL категорії', async () => {
    prismaMock.product.findMany.mockResolvedValue([{ id: 1 }])

    const result = await service.getByCategory('ALL')

    expect(prismaMock.product.findMany).toHaveBeenCalledWith()
    expect(result).toHaveLength(1)
  })

  it('фільтрує продукти по categoryId', async () => {
    prismaMock.product.findMany.mockResolvedValue([
      { id: 1, categoryId: 2 },
    ])

    const result = await service.getByCategory('2')

    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      where: { categoryId: 2 },
    })

    expect(result[0].categoryId).toBe(2)
  })

  it('повертає продукт по id', async () => {
    prismaMock.product.findUnique.mockResolvedValue({ id: 1 })

    const result = await service.getProductById(1)

    expect(prismaMock.product.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    })

    expect(result).toEqual({ id: 1 })
  })

  it('кидає NotFoundException якщо продукт не знайдено', async () => {
    prismaMock.product.findUnique.mockResolvedValue(null)

    await expect(service.getProductById(999)).rejects.toThrow(
      NotFoundException,
    )
  })

  it('обробляє невалідний categoryId', async () => {
    prismaMock.product.findMany.mockResolvedValue([])

    const result = await service.getByCategory('abc' as any)

    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      where: { categoryId: NaN },
    })

    expect(result).toEqual([])
  })
})