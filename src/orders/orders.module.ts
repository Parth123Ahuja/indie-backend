import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerOrders } from './entities/orders.entity';
import {OrderItem} from './entities/orderitem.entity';
import { User } from 'src/user/user.entity';
import { Product } from 'src/shop/entities/product.entity';
import { ProductSize } from 'src/shop/entities/product-size.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerOrders,User, Product,OrderItem,ProductSize])],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
