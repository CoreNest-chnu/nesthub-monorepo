import { Controller, Get, Param, Query } from '@nestjs/common'
import { ProductService } from './product.service'
import { PaginationQueryDto } from './dto/product.dto'
import { PaginatedResponseDto, ProductModel } from './dto/product.model'
import { ApiResponse } from '@nestjs/swagger'
import { ProductId } from 'generated/prisma/types'

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiResponse({ status: 201, type: PaginatedResponseDto })
  async products(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto> {
    return await this.productService.getProducts(query)
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ProductModel })
  async findbyId(@Param('id') id: ProductId): Promise<ProductModel> {
    return await this.productService.findById(id)
  }
}
