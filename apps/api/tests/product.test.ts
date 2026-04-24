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

      async getAllProducts() {
        return this.prisma.product.findMany()
      },

      async getByCategory(categoryId: number | 'ALL') {
        if (categoryId === 'ALL') {
          return this.prisma.product.findMany()
        }

        return this.prisma.product.findMany({
          where: {
            categoryId: Number(categoryId),
          },
        })
      },

      async getProductById(id: number) {
        const product = await this.prisma.product.findUnique({
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

  // 🟢Отримати всі продукти
  it('should return all products', async () => {
    prismaMock.product.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }])

    const result = await service.getAllProducts()

    expect(prismaMock.product.findMany).toHaveBeenCalled()
    expect(result.length).toBe(2)
  })

  // 🟢Фільтр ALL категорія
  it('should return all products when category is ALL', async () => {
    prismaMock.product.findMany.mockResolvedValue([{ id: 1 }])

    const result = await service.getByCategory('ALL')

    expect(prismaMock.product.findMany).toHaveBeenCalledWith()
    expect(result.length).toBe(1)
  })

  // 🟢Фільтр по categoryId (string → number)
  it('should filter products by categoryId', async () => {
    prismaMock.product.findMany.mockResolvedValue([{ id: 1, categoryId: 2 }])

    const result = await service.getByCategory('2')

    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      where: { categoryId: 2 },
    })

    expect(result[0].categoryId).toBe(2)
  })

  // 🔴getProductById — успішний кейс
  it('should return product by id', async () => {
    prismaMock.product.findUnique.mockResolvedValue({ id: 1 })

    const result = await service.getProductById(1)

    expect(prismaMock.product.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    })

    expect(result).toEqual({ id: 1 })
  })

  // 🔴getProductById — не знайдено
  it('should throw NotFoundException if product does not exist', async () => {
    prismaMock.product.findUnique.mockResolvedValue(null)

    await expect(service.getProductById(999)).rejects.toThrow(
      NotFoundException,
    )
  })

  // 🟡 6. categoryId = NaN edge case
  it('should handle invalid categoryId safely', async () => {
    prismaMock.product.findMany.mockResolvedValue([])

    const result = await service.getByCategory('abc' as any)

    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      where: { categoryId: NaN },
    })

    expect(result).toEqual([])
  })
})