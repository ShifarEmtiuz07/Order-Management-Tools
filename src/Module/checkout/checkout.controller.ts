import { CheckoutService } from './checkout.service';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  create(@Body() createCheckoutDto: CreateCheckoutDto[]) {
    return this.checkoutService.createCheckout(createCheckoutDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('searchTerm') searchTerm: string,
  ) {
    return this.checkoutService.getCheckout(page, limit, searchTerm);
  }

  @Get(':checkoutNumber')
  findOne(@Param('checkoutNumber') checkoutNumber: string) {
    return this.checkoutService.find(checkoutNumber);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateCheckoutDto: UpdateCheckoutDto,
  ) {
    return this.checkoutService.update(id, updateCheckoutDto);
  }
}
