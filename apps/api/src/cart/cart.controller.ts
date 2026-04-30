import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CartService } from './cart.service'
import { JwtAuthGuard } from 'src/auth/auth.guard'
import { CartItemModel, CartModel } from './dto/cart.model'
import { CartItemDto, UpdateCartItemDto } from './dto/cart.dto'
import { CurrentUser } from 'src/user/user.util'
import { User } from 'generated/prisma/browser'

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getCart(@Param('id') id: string): Promise<CartModel> {
    return await this.cartService.getCart(id)
  }

  @Post('items')
  @UseGuards(JwtAuthGuard)
  async addItem(
    @CurrentUser() { id }: User,
    @Body() cartItemDto: CartItemDto,
  ): Promise<CartItemModel> {
    return await this.cartService.addItem({
      id,
      ...cartItemDto,
    })
  }

  @Patch('items/:id')
  @UseGuards(JwtAuthGuard)
  async updateItem(
    @CurrentUser() { id }: User,
    @Param('id') cartItemId: string,
    @Body() updateItemDto: UpdateCartItemDto,
  ): Promise<CartItemModel> {
    return await this.cartService.updateItem({
      id,
      cartItemId,
      ...updateItemDto,
    })
  }
}
