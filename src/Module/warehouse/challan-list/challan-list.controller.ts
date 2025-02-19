import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChallanListService } from './challan-list.service';
import { CreateChallanListDto } from './dto/create-challan-list.dto';
import { UpdateChallanListDto } from './dto/update-challan-list.dto';

@Controller('challan-list')
export class ChallanListController {
  constructor(private readonly challanListService: ChallanListService) {}

  @Post()
  create(@Body() createChallanListDto: CreateChallanListDto) {
    return this.challanListService.create(createChallanListDto);
  }

  @Get()
  findAll() {
    return this.challanListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.challanListService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChallanListDto: UpdateChallanListDto) {
    return this.challanListService.update(+id, updateChallanListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.challanListService.remove(+id);
  }
}
