import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    searchTerm,
  ): Promise<{
    status: number;
    totalProducts: number;
    currentPage: number;
    totalPages: number;
    message: string;
    data: Product[];
  }> {
    let queryBuilder = await this.productRepository
      .createQueryBuilder('product')
      .orderBy('product.createdAt', 'DESC')
      .leftJoinAndSelect('product.category', 'category');

    if (searchTerm) {
      queryBuilder.where(
        'product.nameBn ILIKE :searchTerm OR  product.nameEn ILIKE :searchTerm OR product.slug ILIKE :searchTerm OR product.searchTag ILIKE :searchTerm',
        { searchTerm: `%${searchTerm}%` },
      );
    }

    const [products, totalCount] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();
    const totalPages = Math.ceil(totalCount / limit);

    return {
      status: 200,
      totalProducts: totalCount,
      currentPage: page,
      totalPages,
      message: 'Retrieved category successfully',
      data: products,
    };
  }

  async findOne(productCode: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { productCode: productCode },
      relations: ['category'],
    });
    return product;
  }

  async update(productCode: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.findOne({
        where: { productCode },
      });
      console.log(product)
      Object.assign(product, updateProductDto);
      const updatedProduct = await this.productRepository.save(product);
      return {
        status: 200,
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      return {
        status: 404,
        message: `#${productCode} product did not update`,
      };
    }
  }

  async remove(productCode: string) {
    try {
      const product = await this.productRepository.findOne({
        where: { productCode: productCode },
        relations: ['category'],
      });
      await this.productRepository.remove(product);
      return `This action removes a #${productCode} product`;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Product deletion failed',
      );
    }
  }
}
