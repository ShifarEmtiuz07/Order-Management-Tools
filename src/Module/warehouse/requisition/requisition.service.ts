import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRequisitionDto } from './dto/create-requisition.dto';
import { UpdateRequisitionDto } from './dto/update-requisition.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/Module/order/entities/order.entity';
import { Repository } from 'typeorm';
import { Employee } from 'src/Module/employee/entities/employee.entity';
import { generateRequisitionNumber } from 'src/utils/order.util';
import { Requisition } from './entities/requisition.entity';
import { OrderStatus } from 'src/utils/orderStatus.enum';

@Injectable()
export class RequisitionService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Requisition)
    private readonly requisitionRepository: Repository<Requisition>,
  ) {}
  async create(createRequisitionDto: CreateRequisitionDto[]) {
    
    try {
      const requisitionNumber = generateRequisitionNumber();

      const requisitionEntity = [];
      for (const dto of createRequisitionDto) {
        // console.log(dto)
        const order = await this.orderRepository.findOne({
          where: { orderNumber: dto.orderNumber },
        });
        // console.log(order)
        if (!order) {
          throw new InternalServerErrorException(
            `${order.orderNumber} does not exsist`,
          );
        }
        const emoloyee = await this.employeeRepository.findOne({
          where: { employeeId: dto.employeeId },
        });
        // console.log(emoloyee)

        if (!emoloyee) {
          throw new InternalServerErrorException(
            `${emoloyee.id} does not exsist`,
          );
        }

        const requisition = new Requisition();
        requisition.order = order;
        requisition.orderNumber = dto.orderNumber;
        requisition.requisitionNumber = requisitionNumber;
        requisitionEntity.push(requisition);

        await this.orderRepository.update(order.id, {
          orderStatus: OrderStatus.Store,
        });
      }
      // console.log(requisitionEntity)
      const savedRequisitionEntity =
        await this.requisitionRepository.save(requisitionEntity);

      return savedRequisitionEntity;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Requisition creation failed',
      );
    }
  }

  findAll() {
    return `This action returns all requisition`;
  }

  findOne(id: number) {
    return `This action returns a #${id} requisition`;
  }

  update(id: number, updateRequisitionDto: UpdateRequisitionDto) {
    return `This action updates a #${id} requisition`;
  }

  remove(id: number) {
    return `This action removes a #${id} requisition`;
  }
}
