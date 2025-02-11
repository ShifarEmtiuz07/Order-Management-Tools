import { RolesGuard } from 'src/utils/roles.guard';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto) {
    try {
      const inventory =
        await this.inventoryRepository.create(createInventoryDto);
      // console.log(inventory)
      const savedEntity = await this.inventoryRepository.save(inventory);
      return savedEntity;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Inventory did not create',
      );
    }
  }

  async findAll() {
    return await this.inventoryRepository.find({
      relations: ['productCode'],
      select: {
        id: true,
        productQuantity: true,
        productCode: {
          productNameEn: true,
          productNameBn: true,
          packSize: true,
          productCode: true,
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.inventoryRepository.findOne({
      where: { id: id },
      relations: ['productCode'],
      select: {
        id: true,
        productQuantity: true,
        productCode: {
          productNameEn: true,
          productNameBn: true,
          packSize: true,
          productCode: true,
        },
      },
    });
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    const inventory = await this.inventoryRepository.findOne({
      where: { id: id },
    });

    Object.assign(inventory, updateInventoryDto);
    const updatedEntity = await this.inventoryRepository.save(inventory);

    return updatedEntity;
  }

  async remove(id: number) {
    const inventory = await this.inventoryRepository.findOne({
      where: { id: id },
    });
    return await this.inventoryRepository.remove(inventory);
  }
}
