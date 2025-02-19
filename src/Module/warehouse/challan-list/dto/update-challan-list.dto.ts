import { PartialType } from '@nestjs/mapped-types';
import { CreateChallanListDto } from './create-challan-list.dto';

export class UpdateChallanListDto extends PartialType(CreateChallanListDto) {}
