import { NotFoundException } from '@nestjs/common'

type PrismaMock = {
  product: {
    findMany: jest.Mock<Promise<unknown[]>, [unknown?]>
    findUnique: jest.Mock<Promise<unknown>, [unknown]>
  }
}

type Service = {
  prisma: PrismaMock
  getAllProducts: () => Promise<unknown[]>
  getByCategory: (categoryId: number | string) => Promise<unknown[]>
  getProductById: (id: number) => Promise<unknown>
}

describe('ProductService', () => {
<<<<<<< HEAD
  let prismaMock: PrismaMock
  let service: Service
=======
  let prismaMock: {
    product: {
      findMany: ReturnType<typeof mock>
      findUnique: ReturnType<typeof mock>
    }
  }

  let service: {
    getAllProducts: () => Promise<unknown>
    getByCategory: (categoryId: number | 'ALL') => Promise<unknown>
    getProductById: (id: number) => Promise<unknown>
  }
>>>>>>> 6079ae6 (fix: product tests and lint issues)

  beforeEach(() => {
    prismaMock = {
      product: {
        findMany: jest.fn<Promise<unknown[]>, [unknown?]>(),
        findUnique: jest.fn<Promise<unknown>, [unknown]>(),
      },
    }

    service = {
<<<<<<< HEAD
      prisma: prismaMock,

      getAllProducts: () => {
=======
      getAllProducts: async () => {
>>>>>>> 6079ae6 (fix: product tests and lint issues)
        return prismaMock.product.findMany()
      },

      getByCategory: (categoryId: number | string) => {
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
<<<<<<< HEAD

    jest.clearAllMocks()
=======
>>>>>>> 6079ae6 (fix: product tests and lint issues)
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
    prismaMock.product.findMany.mockResolvedValue([{ id: 1, categoryId: 2 }])

    const result = await service.getByCategory('2') as Array<{ categoryId: number }>

    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      where: { categoryId: 2 },
    })

    expect(result[0]).toEqual({ id: 1, categoryId: 2 })
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

    await expect(service.getProductById(999)).rejects.toThrow(NotFoundException)
  })

  it('обробляє невалідний categoryId', async () => {
    prismaMock.product.findMany.mockResolvedValue([])

    const result = await service.getByCategory('abc')

    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      where: { categoryId: Number.NaN },
    })

    expect(result).toEqual([])
  })
})
