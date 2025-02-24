import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderLogService } from './order-log.service';
import { CreateOrderLogDto } from './dto/create-order-log.dto';
import { UpdateOrderLogDto } from './dto/update-order-log.dto';

@Controller('order-log')
export class OrderLogController {
  constructor(private readonly orderLogService: OrderLogService) {}

  @Post()
  create(@Body() createOrderLogDto: CreateOrderLogDto) {
    return this.orderLogService.create(createOrderLogDto);
  }

  @Get()
  findAll() {
    return this.orderLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderLogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderLogDto: UpdateOrderLogDto) {
    return this.orderLogService.update(+id, updateOrderLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderLogService.remove(+id);
  }
}
