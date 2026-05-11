import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CartService } from './cart.service'
import { JwtAuthGuard } from 'src/auth/auth.guard'
import { CartItemModel, CartModel, CartWithStockModel } from './dto/cart.model'
import { CartItemDto, UpdateCartItemDto } from './dto/cart.dto'
import { CurrentUser } from 'src/user/user.util'
import { User } from 'generated/prisma/browser'
import { ApiResponse } from '@nestjs/swagger'
import { UserId } from 'generated/prisma/types'

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':id')
  @ApiResponse({ status: 200, type: CartModel })
  @UseGuards(JwtAuthGuard)
  async getCart(@Param('id') id: UserId): Promise<CartWithStockModel> {
    return await this.cartService.getCart(id)
  }

  @Post('items')
  @ApiResponse({ status: 201, type: CartItemModel })
  @UseGuards(JwtAuthGuard)
  async addItem(
    @CurrentUser() { id }: User,
    @Body() cartItemDto: CartItemDto,
  ): Promise<CartItemModel> {
    return await this.cartService.add({
      id,
      ...cartItemDto,
    })
  }

  @Patch('items/:id')
  @ApiResponse({ status: 200, type: CartItemModel })
  @UseGuards(JwtAuthGuard)
  async updateItem(
    @CurrentUser() { id }: User,
    @Param('id') cartItemId: string,
    @Body() updateItemDto: UpdateCartItemDto,
  ): Promise<CartItemModel> {
    return await this.cartService.update({
      id,
      cartItemId,
      ...updateItemDto,
    })
  }

  @Delete('items/:id')
  @ApiResponse({
    status: 204,
    description: 'Successfully deleted item from cart',
  })
  @UseGuards(JwtAuthGuard)
  async deleteItem(
    @CurrentUser() { id }: User,
    @Param('id') cartItemId: string,
  ): Promise<void> {
    return await this.cartService.delete({ userId: id, cartItemId })
  }
}
