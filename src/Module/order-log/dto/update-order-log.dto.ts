import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderLogDto } from './create-order-log.dto';

export class UpdateOrderLogDto extends PartialType(CreateOrderLogDto) {}
