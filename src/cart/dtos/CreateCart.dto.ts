// src/cart/dto/create-cart.dto.ts
import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { User } from '../../user/user.entity';

export class CreateCartDto {
  @IsObject()
  @IsNotEmpty()
  user: User;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
