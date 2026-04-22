import { Controller, Get, Query } from '@nestjs/common'
import { ProductService } from './product.service'
import { PaginationQueryDto } from './dto/product.dto'
import { PaginatedResponseDto } from './dto/product.model'

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async products(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto> {
    return await this.productService.getProducts(query)
  }
}
