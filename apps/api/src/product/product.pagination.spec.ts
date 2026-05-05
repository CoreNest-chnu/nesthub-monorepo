type PrismaMock = {
  product: {
    findMany: jest.Mock<Promise<unknown[]>, [unknown?]>
  }
}

type PaginationQuery = { page: number; limit: number }

type Service = {
  prisma: PrismaMock
  getAllProducts: (query: PaginationQuery) => Promise<unknown[]>
}

describe('Product pagination', () => {
<<<<<<< HEAD
  let prismaMock: PrismaMock
  let service: Service
=======
  let prismaMock: {
  product: {
    findMany: ReturnType<typeof mock>
  }
}

let service: {
  getAllProducts: (query: { page: number; limit: number }) => Promise<unknown>
}
>>>>>>> 6079ae6 (fix: product tests and lint issues)

  beforeEach(() => {
    prismaMock = {
      product: {
        findMany: jest.fn<Promise<unknown[]>, [unknown?]>(),
      },
    }

    service = {
      prisma: prismaMock,

<<<<<<< HEAD
      getAllProducts: (query: PaginationQuery) => {
        const skip = (query.page - 1) * query.limit
=======
      getAllProducts: async (query: { page: number; limit: number }) => {
        const page = Math.max(query.page, 1)
        const skip = (page - 1) * query.limit
>>>>>>> 6079ae6 (fix: product tests and lint issues)

        return prismaMock.product.findMany({
          skip,
          take: query.limit,
        })
      },
    }
<<<<<<< HEAD

    jest.clearAllMocks()
=======
>>>>>>> 6079ae6 (fix: product tests and lint issues)
  })

  it('повертає продукти з пагінацією', async () => {
    prismaMock.product.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }])

    const result = await service.getAllProducts({
      page: 1,
      limit: 10,
    })

    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
    })

    expect(result).toHaveLength(2)
  })

  it('правильно рахує skip для сторінки', async () => {
    prismaMock.product.findMany.mockResolvedValue([])

    await service.getAllProducts({
      page: 3,
      limit: 10,
    })

    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      skip: 20,
      take: 10,
    })
  })

  it('не дає негативний skip якщо page < 1', async () => {
    prismaMock.product.findMany.mockResolvedValue([])

    await service.getAllProducts({
      page: -5,
      limit: 10,
    })

    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
    })
  })
})
