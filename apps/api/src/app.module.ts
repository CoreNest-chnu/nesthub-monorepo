import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { ProductModule } from './product/product.module'
import { CategoriesModule } from './category/category.module'
import { CartModule } from './cart/cart.module'
import { OrderModule } from './order/order.module'
import { PromoModule } from './promo/promo.module'
import { PaymentModule } from './payment/payment.module'

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProductModule,
    CategoriesModule,
    CartModule,
    OrderModule,
    PromoModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
