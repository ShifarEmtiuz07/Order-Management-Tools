import { CheckoutService } from './checkout.service';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateOrderItemsDto } from './dto/create-orderItems.dto';
import { get } from 'http';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  create(@Body() createOrderItemsDto: CreateOrderItemsDto[]) {
    return this.checkoutService.createCheckout(createOrderItemsDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('searchTerm') searchTerm: string,
  ) {
    return this.checkoutService.getCheckout(page,limit,searchTerm);
  }

  @Get(':orderNumber')
  findOne(@Param('orderNumber') orderNumber: string) {
    return this.checkoutService.findOne(orderNumber);
  }
}
