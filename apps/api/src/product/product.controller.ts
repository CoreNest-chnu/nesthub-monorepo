import { Controller, Get, Query } from '@nestjs/common'
import { ProductService } from './product.service'
import { PaginationQueryDto } from './dto/product.dto'
import { PaginatedResponseDto } from './dto/product.model'
import { ApiResponse } from '@nestjs/swagger'

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
}
