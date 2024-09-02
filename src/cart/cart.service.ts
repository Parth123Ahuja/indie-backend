import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-Item.entity';
import { User } from '../user/user.entity';
import { Product } from '../shop/entities/product.entity';
import { threadId } from 'worker_threads';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createCart(user: User): Promise<Cart> {
    const cart = this.cartRepository.create({ firebaseUid: user.firebaseUid, user, items: [] });
    return this.cartRepository.save(cart);
  }

  async addItemToCart(user: User, productId: number, quantity: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({ where: { firebaseUid: user.firebaseUid }, relations: ['items'] });
    if (!cart) {
      cart = await this.createCart(user);
    }

    const product = await this.productRepository.findOneBy({id: productId});
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    
    let cartItem = cart.items.find(item => item.id === productId);
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartItemRepository.create({ cart, product, quantity });
      cart.items.push(cartItem);
    }

    await this.cartItemRepository.save(cartItem);
     return this.cartRepository.save(cart);
  }

  async removeItemFromCart(user: User, productId: number) {
    console.log("remove function called"+ productId);
    let cart = await this.cartRepository.findOne({ where: { firebaseUid: user.firebaseUid }, relations: ['items'] });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const product = await this.cartItemRepository.findOneBy({"id":productId});
    if(!product){
      throw new NotFoundException('product not found');
    }
    
    return await this.cartItemRepository.remove(product);
  }

  async clearCart(user: User): Promise<Cart> {
    let cart = await this.cartRepository.findOne({ where: { firebaseUid: user.firebaseUid }, relations: ['items'] });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.items = [];
    await this.cartRepository.save(cart);
    return cart;
  }

  async getCart(user: User){
    console.log("cart service "+user.firebaseUid);
    const cart = await this.cartRepository.findOne({
      where: {firebaseUid: user.firebaseUid },
      relations: ['items', 'items.product']  // Load related CartItems and their associated Products
    });

    if (!cart) {
      throw new NotFoundException("cart not found");

    }

    return (cart.items);
  }
}
