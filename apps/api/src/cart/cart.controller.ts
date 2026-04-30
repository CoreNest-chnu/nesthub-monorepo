import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { CartService } from './cart.service'
import { JwtAuthGuard } from 'src/auth/auth.guard'
import { CartItemModel, CartModel } from './dto/cart.model'
import { UserId } from 'generated/prisma/types'
import { itemDTO } from './dto/cart.dto'

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getCart(@Param('id') id: UserId): Promise<CartModel> {
    return await this.cartService.getCart(id)
  }

  @Post('items')
  @UseGuards(JwtAuthGuard)
  async addItem(@Body() itemDTO: itemDTO): Promise<CartItemModel> {
    return await this.cartService.addItem(itemDTO)
  }
}
