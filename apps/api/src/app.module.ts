import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { ProductModule } from './product/product.module'
import { CategoryModule } from './category/category.module'

@Module({
  imports: [AuthModule, UserModule, ProductModule, CategoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
