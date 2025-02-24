import { Injectable } from '@nestjs/common';
import { CreateOrderLogDto } from './dto/create-order-log.dto';
import { UpdateOrderLogDto } from './dto/update-order-log.dto';

@Injectable()
export class OrderLogService {
  create(createOrderLogDto: CreateOrderLogDto) {
    return 'This action adds a new orderLog';
  }

  findAll() {
    return `This action returns all orderLog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderLog`;
  }

  update(id: number, updateOrderLogDto: UpdateOrderLogDto) {
    return `This action updates a #${id} orderLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderLog`;
  }
}
