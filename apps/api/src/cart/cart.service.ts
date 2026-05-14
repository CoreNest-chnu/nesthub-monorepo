import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { CartItemModel, CartWithStockModel } from './dto/cart.model'
import { UserId } from 'generated/prisma/types'
import { CartItemDto, UpdateCartItemDto } from './dto/cart.dto'
import { ProductModel } from '../product/dto/product.model'

const recommendationLimit = 8

export type AddCartItem = {
  id: UserId
} & CartItemDto

type UpdateCartItems = {
  id: UserId
  cartItemId: string
} & UpdateCartItemDto

type DeleteCartItem = {
  userId: UserId
  cartItemId: string
}

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string): Promise<CartWithStockModel> {
    const cart = await this.prisma.cart.findUniqueOrThrow({
      where: {
        userId,
      },
      include: {
        Items: {
          include: {
            Product: { include: { Category: true } },
          },
        },
      },
    })

    return {
      ...cart,
      Items: cart.Items.map((item) => ({
        ...item,
        isOverStock: item.quantity > item.Product.stock,
      })),
    }
  }

  async add({ id, productId, qty }: AddCartItem): Promise<CartItemModel> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true },
    })

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    const cart = await this.prisma.cart.findUnique({
      where: { userId: id },
      select: { id: true },
    })

    if (!cart) {
      throw new NotFoundException("You don't have cart, pls contact support")
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      select: { quantity: true },
    })

    const currentQty = cartItem?.quantity ?? 0

    if (currentQty + qty > product.stock) {
      throw new BadRequestException("We don't have such amount in stock")
    }

    return await this.prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      update: {
        quantity: { increment: qty },
      },
      create: {
        cartId: cart.id,
        productId,
        quantity: qty,
      },
      include: { Product: { include: { Category: true } } },
    })
  }

  async update({
    id,
    cartItemId,
    qty,
  }: UpdateCartItems): Promise<CartItemModel> {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { Product: true, Cart: true },
    })

    if (!cartItem) {
      throw new NotFoundException('There is no such item in your cart')
    }

    if (cartItem.Cart.userId !== id) {
      throw new ForbiddenException('You do not have access to this cart item')
    }

    if (cartItem.Product.stock < qty) {
      throw new BadRequestException("We don't have such amount in stock")
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: qty },
      include: { Product: { include: { Category: true } } },
    })
  }

  async getRecommendations(userId: UserId): Promise<ProductModel[]> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { Items: { select: { productId: true } } },
    })

    const cartProductIds = cart?.Items.map(({ productId }) => productId) ?? []

    if (cartProductIds.length === 0) {
      return []
    }

    const coBoughtOrders = await this.prisma.orderItem.findMany({
      where: { productId: { in: cartProductIds } },
      select: { orderId: true },
      distinct: ['orderId'],
    })
    const orderIds = coBoughtOrders.map(({ orderId }) => orderId)

    const grouped = orderIds.length
      ? await this.prisma.orderItem.groupBy({
          by: ['productId'],
          where: {
            orderId: { in: orderIds },
            productId: { notIn: cartProductIds },
            Product: { stock: { gt: 0 } },
          },
          _count: { productId: true },
          orderBy: { _count: { productId: 'desc' } },
          take: recommendationLimit,
        })
      : []

    const coBoughtIds = grouped.map(({ productId }) => productId)

    const fetched = coBoughtIds.length
      ? await this.prisma.product.findMany({
          where: { id: { in: coBoughtIds } },
          include: { Category: true },
        })
      : []

    const productById = new Map(fetched.map((product) => [product.id, product]))

    const coBoughtProducts = coBoughtIds.flatMap((id) => {
      const product = productById.get(id)

      return product ? [product] : []
    })

    if (coBoughtProducts.length >= recommendationLimit) {
      return coBoughtProducts
    }

    const cartCategoryIds = await this.prisma.product.findMany({
      where: { id: { in: cartProductIds } },
      select: { categoryId: true },
      distinct: ['categoryId'],
    })

    const excludeIds = [...cartProductIds, ...coBoughtProducts.map((p) => p.id)]
    const fallback = await this.prisma.product.findMany({
      where: {
        categoryId: { in: cartCategoryIds.map((c) => c.categoryId) },
        id: { notIn: excludeIds },
        stock: { gt: 0 },
      },
      include: { Category: true },
      orderBy: { rating: 'desc' },
      take: recommendationLimit - coBoughtProducts.length,
    })

    return [...coBoughtProducts, ...fallback]
  }

  async delete({ userId, cartItemId }: DeleteCartItem): Promise<void> {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { Cart: true },
    })

    if (!cartItem) {
      throw new NotFoundException('Wrong cart item id')
    }

    if (cartItem.Cart.userId !== userId) {
      throw new ForbiddenException('You do not have access to this cart item')
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    })
  }
}
