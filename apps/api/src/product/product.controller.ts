import { Controller, Get, Query } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { ProductService } from './product.service'
import { PaginationQueryDto } from './dto/product.dto'
import { PaginatedProductResponseDto } from './dto/product.model'

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiResponse({ status: 200, type: PaginatedProductResponseDto })
  async products(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedProductResponseDto> {
    return await this.productService.getProducts(query)
  }
}
