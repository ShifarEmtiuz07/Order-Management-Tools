import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ChallanListService } from './challan-list.service';
import { CreateChallanListDto } from './dto/create-challan-list.dto';
import { UpdateChallanListDto } from './dto/update-challan-list.dto';

@Controller('warehouse/challan-list')
export class ChallanListController {
  constructor(private readonly challanListService: ChallanListService) {}

  @Post()
  create(@Body() createChallanListDto: CreateChallanListDto) {
    return this.challanListService.create(createChallanListDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('searchTerm') searchTerm: string,
  ) {
    return this.challanListService.findAll(page, limit, searchTerm);
  }

  @Get(':id')
  findOne(@Param('challan') challan: string) {
    return this.challanListService.findOne(challan);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChallanListDto: UpdateChallanListDto,
  ) {
    return this.challanListService.update(+id, updateChallanListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.challanListService.remove(+id);
  }
}
