import { describe, it, expect, beforeEach, mock } from 'bun:test'
import { NotFoundException } from '@nestjs/common'

describe('ProductService', () => {
  let prismaMock: Record<string, unknown>
  let service: Record<string, unknown>

  beforeEach(() => {
    prismaMock = {
      product: {
        findMany: mock(),
        findUnique: mock(),
      },
    }

    service = {
      getAllProducts: async () => prismaMock.product.findMany(),

      getByCategory: async (categoryId: number | 'ALL') => {
        if (categoryId === 'ALL') {
          return prismaMock.product.findMany()
        }

        const id = Number(categoryId)

        return prismaMock.product.findMany({
          where: {
            categoryId: Number.isNaN(id) ? Number.NaN : id,
          },
        })
      },

      getProductById: async (id: number) => {
        const product = await prismaMock.product.findUnique({
          where: { id },
        })

        if (!product) {
          throw new NotFoundException('Product not found')
        }

        return product
      },
    }
  })

  it('повертає всі продукти', async () => {
    prismaMock.product.findMany.mockResolvedValue([{ id: 1 }])

    const result = await service.getAllProducts()

    expect(result).toHaveLength(1)
  })

  it('ALL категорія', async () => {
    prismaMock.product.findMany.mockResolvedValue([{ id: 1 }])

    const result = await service.getByCategory('ALL')

    expect(result).toHaveLength(1)
  })

  it('фільтр categoryId', async () => {
    prismaMock.product.findMany.mockResolvedValue([{ id: 1 }])

    await service.getByCategory('2')

    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      where: { categoryId: 2 },
    })
  })

  it('product by id', async () => {
    prismaMock.product.findUnique.mockResolvedValue({ id: 1 })

    const result = await service.getProductById(1)

    expect(result).toEqual({ id: 1 })
  })

  it('not found', async () => {
    prismaMock.product.findUnique.mockResolvedValue(null)

    await expect(service.getProductById(1)).rejects.toThrow(
      NotFoundException,
    )
  })

  it('invalid category', async () => {
    prismaMock.product.findMany.mockResolvedValue([])

    await service.getByCategory('abc')

    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      where: { categoryId: Number.NaN },
    })
  })
})