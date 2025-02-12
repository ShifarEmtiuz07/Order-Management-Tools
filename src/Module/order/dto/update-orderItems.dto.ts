import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderItemsDto } from './create-orderItems.dto';

export class UpdateOrderItemsDto extends PartialType(CreateOrderItemsDto) {}