import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs-extra';
import { extname } from 'path';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,

    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const second = date.getMilliseconds().toString().padStart(2, '0');
    const format = year + month + day + second;
    let fileName: string;
    if (file && file.originalname) {
      const format = year + month + day + second;
      const ext = extname(file.originalname);
      const baseName = file.originalname.replace(ext, '');
      fileName = createCategoryDto.slug + '-' + format + ext;
      const filePath = `./categoriesUpload/${fileName}`;
      await fs.writeFile(filePath, file.buffer);
    }

    return this.categoryService.create({
      ...createCategoryDto,
      categoryImage: fileName,
    });
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('searchTerm') searchTerm: string,
  ) {
    return this.categoryService.findAll(page, limit, searchTerm);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoryService.findOne(id);
    if (!category) {
      throw new NotFoundException('category not found');
    }

    //if one and only when files && database has categoryImage then delete the database image

    if (file && file.originalname && category.categoryImage) {
      const filePath = `./categoriesUpload/${category.categoryImage}`;

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const second = date.getMilliseconds().toString().padStart(2, '0');
    const format = year + month + day + second;
    let formatedName: string;
    if (file && file.originalname) {
      const format = year + month + day + second;
      const ext = extname(file.originalname);
      const baseName = file.originalname.replace(ext, '');
      formatedName = updateCategoryDto.slug + '-' + format + ext;
      const filePath = `./categoriesUpload/${formatedName}`;
      await fs.writeFile(filePath, file.buffer);
    }
    const fileName =
      file && file.originalname ? formatedName : category.categoryImage;
    return this.categoryService.update(+id, {
      ...updateCategoryDto,
      categoryImage: fileName,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
