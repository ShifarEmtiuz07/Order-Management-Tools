import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import * as fs from 'fs-extra';

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
      fileName = createCategoryDto.name_en + '-' + format + ext;
      const filePath = `./categorysUpload/${fileName}`;
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
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
