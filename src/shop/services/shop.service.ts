import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { CreateProductDto } from '../dtos/create-product.dto';
import { Product } from '../entities/product.entity';
import { ProductSize } from '../entities/product-size.entity';

@Injectable()
export class ShopService {
  private readonly logger = new Logger(ShopService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductSize)
    private readonly productSizeRepository: Repository<ProductSize>,
  ) {}

  async fetchProducts() {
    return await this.productRepository.find({ relations: ['sizes'] });
  }

  async fetchOneProduct(id: number) {
    const product = await this.productRepository.findOne({ where: { id }, relations: ['sizes'] });
    if (!product) {
      throw new NotFoundException(`Product not found with id ${id}`);
    }
    return product;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { sizes, ...productData } = createProductDto;

    const product = this.productRepository.create(productData);
    await this.productRepository.save(product);

    if (sizes && sizes.length > 0) {
      const productSizes = sizes.map(size => this.productSizeRepository.create({ ...size, product }));
      await this.productSizeRepository.save(productSizes);
    }

    return product;
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id }, relations: ['sizes'] });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const { sizes, ...updateData } = updateProductDto;

    // Update the product entity
    Object.assign(product, updateData);
    await this.productRepository.save(product);

    // Handle sizes if provided
    if (sizes) {
      // Delete existing sizes if they are being updated
      await this.productSizeRepository.delete({ product: { id } });

      // Create new sizes and associate them with the product
      const newSizes = sizes.map(size => this.productSizeRepository.create({ ...size, product }));
      await this.productSizeRepository.save(newSizes);
    }

    this.logger.log(`Updating product: ${JSON.stringify(product)}`);
    return this.fetchOneProduct(id);
  }

  async deleteProduct(id: number) {
    // Find the product to ensure it exists
    const product = await this.fetchOneProduct(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Delete associated sizes first
    await this.productSizeRepository.delete({ product: { id } });

    // Perform the deletion by specifying the exact ID
    const deleteResult = await this.productRepository.delete(id);

    // Check if the deletion was successful
    if (deleteResult.affected === 0) {
      throw new NotFoundException('Product not found in db');
    }

    return { message: 'Product deleted successfully' };
  }
}
