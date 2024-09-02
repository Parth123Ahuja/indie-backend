// src/user/user.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dtos/create-user.dto';
import { CartService } from 'src/cart/cart.service';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly cartService: CartService) {}

  @Get("/:email")
  async oneUsers(@Param("email") email: string){
    return await this.userService.findUser(email);
  }

  @Get()
  async allUsers(){
    return await this.userService.findallUser();
  }

  @Post('signup')
  async signUp(@Body() body: createUserDto){
    const exists = await this.userService.forSignup(body.email);
    if(!exists){
      const user = await this.userService.createUser(body.email, body.firebaseUid);
      await this.cartService.createCart(user);
      return user; 
    }
    else{
      throw new ExceptionsHandler;
    }
  }

  // Other controller methods (e.g., login) can go here
}
