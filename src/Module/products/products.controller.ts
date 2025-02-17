import { Product } from 'src/Module/products/entities/product.entity';
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
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import * as fs from 'fs-extra';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('productImage'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    let fileName: string;
    if (file && file.originalname) {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const second = date.getMilliseconds().toString().padStart(2, '0');
      const format = year + month + day + second;
      const ext = extname(file.originalname);
      const baseName = file.originalname.replace(ext, '');
      fileName = createProductDto.productSlug + '-' + format + ext;
      const filePath = `./productsUpload/${fileName}`;
      await fs.writeFile(filePath, file.buffer);
    }
    return this.productsService.create({
      ...createProductDto,
      productImage: fileName,
    });
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('searchTerm') searchTerm: string,
  ) {
    return this.productsService.findAll(page, limit, searchTerm);
  }

  @Get(':productCode')
  findOne(@Param('productCode') productCode: string) {
    return this.productsService.findOne(productCode);
  }

  @Patch(':productCode')
  @UseInterceptors(FileInterceptor('productImage'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('productCode') productCode: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.findOne(productCode);
    if (!product) {
      throw new NotFoundException('product not found');
    }

    //if one and only when files && database has categoryImage then delete the database image

    if (file && file.originalname && product.productImage) {
      const filePath = `./productsUpload/${product.productImage}`;

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    let fileName: string;

    if (file && file.originalname) {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const second = date.getMilliseconds().toString().padStart(2, '0');
      const format = year + month + day + second;
      const ext = extname(file.originalname);
      const baseName = file.originalname.replace(ext, '');
      fileName = updateProductDto.productSlug + '-' + format + ext;
      const filePath = `./productsUpload/${fileName}`;
      await fs.writeFile(filePath, file.buffer);
    }
    const formatedName = file ? fileName : product.productImage;
    console.log(formatedName);

    return this.productsService.update(productCode, {
      ...updateProductDto,
      productImage: formatedName,
    });
  }

  @Delete(':productCode')
  remove(@Param('productCode') productCode: string) {
    return this.productsService.remove(productCode);
  }
}
