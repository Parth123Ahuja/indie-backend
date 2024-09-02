import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ShopService } from './services/shop.service';
import { deleteProductDto } from './dtos/delete-product.dto';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  async allItems() {
    return await this.shopService.fetchProducts();
  }

  @Get(':id')
  async oneItem(@Param('id') id: string) {
    return await this.shopService.fetchOneProduct(parseInt(id));
  }

  @Post('/createproduct')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return await this.shopService.createProduct(createProductDto);
  }

  @Patch('/updateproduct')
  async updateProduct( @Body() updateProductDto: UpdateProductDto) {
    const id = updateProductDto.id
    return await this.shopService.updateProduct(id, updateProductDto);
  }

  @Delete('/deleteproduct')
  async deleteProduct(@Body() deleteProductDto: deleteProductDto) {
    return await this.shopService.deleteProduct(deleteProductDto.id);
  }
}
