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
  let prismaMock: PrismaMock
  let service: Service

  beforeEach(() => {
    prismaMock = {
      product: {
        findMany: jest.fn<Promise<unknown[]>, [unknown?]>(),
      },
    }

    service = {
      prisma: prismaMock,

      getAllProducts: (query: PaginationQuery) => {
        const skip = (query.page - 1) * query.limit

        return prismaMock.product.findMany({
          skip,
          take: query.limit,
        })
      },
    }

    jest.clearAllMocks()
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

  it('повертає масив навіть якщо сторінка велика', async () => {
    prismaMock.product.findMany.mockResolvedValue([])

    const result = await service.getAllProducts({
      page: 999,
      limit: 10,
    })

    expect(result).toEqual([])
  })
})
