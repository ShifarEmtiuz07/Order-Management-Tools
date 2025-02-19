import { Injectable } from '@nestjs/common';
import { CreateChallanListDto } from './dto/create-challan-list.dto';
import { UpdateChallanListDto } from './dto/update-challan-list.dto';

@Injectable()
export class ChallanListService {
  create(createChallanListDto: CreateChallanListDto) {
    return 'This action adds a new challanList';
  }

  findAll() {
    return `This action returns all challanList`;
  }

  findOne(id: number) {
    return `This action returns a #${id} challanList`;
  }

  update(id: number, updateChallanListDto: UpdateChallanListDto) {
    return `This action updates a #${id} challanList`;
  }

  remove(id: number) {
    return `This action removes a #${id} challanList`;
  }
}
