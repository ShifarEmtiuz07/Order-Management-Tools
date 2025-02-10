import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.create(createCategoryDto);
    const savedCategory = await this.categoryRepository.save(category);
    return savedCategory;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    searchTerm,
  ): Promise<{
    status: number,
    currentPage: number,
    totalPages: number,
    message: string,
    data: Category[],
  }> {
    let queryBuilder = await this.categoryRepository
      .createQueryBuilder('category')
      .orderBy('category.id', 'DESC');

    if (searchTerm) {
      queryBuilder.where(
        'category.nameBn ILIKE :searchTerm OR  category.nameEn ILIKE :searchTerm OR category.slug ILIKE :searchTerm',
        { searchTerm: `%${searchTerm}%` },
      );
    }
    const [categorys, totalCount] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();
    const totalPages = Math.ceil(totalCount / limit);

    return {
      status: 200,
      currentPage: page,
      totalPages,
      message: 'Retrieved category successfully',
      data: categorys,
    };
  }

  findOne(id: number) {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({ where: {id} });
    if (!category) {
      throw new NotFoundException('category not found');
    }
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    // const category = await this.categoryRepository.findOne({ where: { id } });
    // if (category) {
    //   return this.categoryRepository.remove(category);
    // }
    try {
      const message = 'Category deleted successfully';
      this.categoryRepository.delete(id);
      return message;
    } catch (error) {
      return error.message || 'Category did not delete';
    }
  }
}
