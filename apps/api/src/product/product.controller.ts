import { Controller, Get, Query } from '@nestjs/common'
import { ProductService } from './product.service'
import {
  PaginatedResponseDto,
  PaginationQueryDto,
  ProductResponseDto,
} from './dto/product.dto'

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async products(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<ProductResponseDto>> {
    return await this.productService.getProducts(query)
  }
}
