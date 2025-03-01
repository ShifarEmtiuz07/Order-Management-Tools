import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRequisitionDto } from './dto/create-requisition.dto';
import { UpdateRequisitionDto } from './dto/update-requisition.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/Module/order/entities/order.entity';
import { Repository } from 'typeorm';
import { Employee } from 'src/Module/employee/entities/employee.entity';
import { generateRequisitionNumber } from 'src/utils/order.util';
import { Requisition } from './entities/requisition.entity';
import { OrderStatus } from 'src/utils/orderStatus.enum';
import { OrderLog } from 'src/Module/order-log/entities/order-log.entity';

@Injectable()
export class RequisitionService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Requisition)
    private readonly requisitionRepository: Repository<Requisition>,
    @InjectRepository(OrderLog)
    private readonly orderlogRepository: Repository<OrderLog>,
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
          throw new NotFoundException(`${order.orderNumber} does not exsist`);
        }

        const employee = await this.employeeRepository.findOne({
          where: { employeeId: dto.employeeId },
        });

        //requisition history

        const log = ` ${requisitionNumber} is created for ${order.orderNumber} & created by employeeId: ${employee.employeeId}`;
        const requisitionLog = new OrderLog();
        (requisitionLog.orderNumber = order.orderNumber),
          (requisitionLog.order = order),
          (requisitionLog.orderStatus = order.orderStatus),
          (requisitionLog.employee = employee),
          (requisitionLog.log = log);

        const history = await this.orderlogRepository.create(requisitionLog);
        await this.orderlogRepository.save(history);

        // console.log(emoloyee)

        if (!employee) {
          throw new InternalServerErrorException(
            `${employee.id} does not exsist`,
          );
        }

        const requisition = new Requisition();
        requisition.order = [order];
        requisition.orderNumber = dto.orderNumber;
        requisition.requisitionNumber = requisitionNumber;
        requisitionEntity.push(requisition);

        await this.orderRepository.update(order.id, {
          orderStatus: OrderStatus.Store,
        });
      }
      //  console.log(requisitionEntity)
      const createRequisitionEntity =
        await this.requisitionRepository.create(requisitionEntity);

      const savedRequisitionEntity = await this.requisitionRepository.save(
        createRequisitionEntity,
      );

      console.log(savedRequisitionEntity);

      return savedRequisitionEntity;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Requisition creation failed',
      );
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    searchTerm,
  ): Promise<{
    status: number;
    totalRequisitions: number;
    currentPage: number;
    totalPages: number;
    message: string;
    data: Requisition[];
  }> {
    const queryBuilder = await this.requisitionRepository
      .createQueryBuilder('requisitions')
      //  .select('requisitions.requisitionNumber','requisitionNumber')
      // // .addSelect('requisitions.requisitionNumber', 'requisitionNumber')
      // .addSelect('COUNT(requisitions.id)', 'requisitionsCount')
      //  .addSelect('COUNT(order.id)', 'orderCount')
      .leftJoinAndSelect('requisitions.order', 'order')
      //  .groupBy('requisitions.requisitionNumber')
      //   .groupBy('order.id')
      //   .addGroupBy('requisitionsCount')
      .orderBy('requisitions.created_at', 'DESC');

    if (searchTerm) {
      queryBuilder.where('requisitions.requisitionNumber ILIKE :searchTerm', {
        searchTerm: `${searchTerm}`,
      });
    }
    const [requisitions, totalCount] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    const totalPages = Math.ceil(totalCount / limit);

    return {
      status: 200,
      totalRequisitions: totalCount,
      currentPage: page,
      totalPages,
      message: 'Retrieved requisitions successfully',
      data: requisitions,
    };
  }

  async findOne(requisitionNumber: string) {
    try {
      const requisition = await this.requisitionRepository.find({
        where: { requisitionNumber: requisitionNumber },
        relations: ['order'],
      });
      return requisition;
    } catch (error) {
      throw new NotFoundException(error.message);
    }

    //return `This action returns a #${id} requisition`;
  }

  update(id: number, updateRequisitionDto: UpdateRequisitionDto) {
    return `This action updates a #${id} requisition`;
  }

  remove(id: number) {
    return `This action removes a #${id} requisition`;
  }
}
