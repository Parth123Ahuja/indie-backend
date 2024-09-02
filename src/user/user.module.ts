// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CartModule], // Make sure User entity is included here
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // Export UserService if used elsewhere
})
export class UserModule {}
