import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateChallanListDto } from './dto/create-challan-list.dto';
import { UpdateChallanListDto } from './dto/update-challan-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChallanList } from './entities/challan-list.entity';
import { Requisition } from '../requisition/entities/requisition.entity';
import { Order } from 'src/Module/order/entities/order.entity';
import { generateChallanNumber } from 'src/utils/order.util';
import { Checkout } from 'src/Module/checkout/entities/checkout.entity';
import { Inventory } from 'src/Module/inventory/entities/inventory.entity';
import { Product } from 'src/Module/products/entities/product.entity';
import { OrderStatus } from 'src/utils/orderStatus.enum';
import { Employee } from 'src/Module/employee/entities/employee.entity';
import { OrderLog } from 'src/Module/order-log/entities/order-log.entity';

@Injectable()
export class ChallanListService {
  constructor(
    @InjectRepository(ChallanList)
    private readonly challanListRepository: Repository<ChallanList>,
    @InjectRepository(Requisition)
    private readonly requisitionRepository: Repository<Requisition>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Checkout)
    private readonly checkoutRepository: Repository<Checkout>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(OrderLog)
    private readonly orderlogRepository: Repository<OrderLog>,
  ) {}
  async create(createChallanListDto: CreateChallanListDto) {
    try {
      const requisitionNumber = createChallanListDto.requisitionNumber;
      const challanNo = generateChallanNumber();

      const requisitions = await this.requisitionRepository.find({
        where: { requisitionNumber: requisitionNumber },
      });

      // console.log(requisitions);
      let challans = [];

      for (const requisition of requisitions) {
        const order = await this.orderRepository.findOne({
          where: { orderNumber: requisition.orderNumber },
        });
        await this.orderRepository.update(order.id, {
          orderStatus: OrderStatus.Delivered,
        });
        // console.log(order)
        if (!order) {
          throw new NotFoundException(`${order.orderNumber} does not exsist`);
        }
        const employee = await this.employeeRepository.findOne({
          where: { employeeId: createChallanListDto.employeeId },
        });

        const checkouts = await this.checkoutRepository.find({
          where: { checkoutNumber: order.checkoutNumber },
        });

        const log = ` ${challanNo} is created for ${order.orderNumber} & created by employeeId: ${employee.employeeId}`;
        const challanLog = new OrderLog();
        (challanLog.orderNumber = order.orderNumber),
          (challanLog.order = order),
          (challanLog.orderStatus = order.orderStatus),
          (challanLog.employee = employee),
          (challanLog.log = log);

        const history = await this.orderlogRepository.create(challanLog);
        await this.orderlogRepository.save(history);

        //console.log(checkouts);
        for (const checkout of checkouts) {
          //console.log(checkout)
          const inventory = await this.inventoryRepository.findOne({
            where: { productItemCode: { productCode: checkout.productCode } },
            relations: ['productItemCode'],
          });
          //const inventory = await this.inventoryRepository.findOne({ where: { productCode:{productCode:checkout.productCode} } });
          console.log(inventory);
          const quantity = inventory.productQuantity - checkout.productQuantity;
          await this.inventoryRepository.update(inventory.id, {
            productQuantity: quantity,
          });
        }
        const challan = new ChallanList();
        (challan.order = [order]),
          (challan.requisition = [requisition]),
          (challan.challanNo = challanNo),
          (challan.requisitionNumber = requisitionNumber),
          (challan.dispatchhub = createChallanListDto.dispatchhub);
        challans.push(challan);
      }
      const createChallan = await this.challanListRepository.create(challans);
      const savedChallan = await this.challanListRepository.save(createChallan);
      return savedChallan;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    //return 'This action adds a new challanList';
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    searchTerm,
  ): Promise<{
    status: number;
    totalChallanList: number;
    currentPage: number;
    totalPages: number;
    message: string;
    data: ChallanList[];
  }> {
    const queryBuilder = await this.challanListRepository
      .createQueryBuilder('challanList')
      .orderBy('challanList.createdAt', 'DESC')
      .leftJoinAndSelect('challanList.requisition', 'requisition')
      .leftJoinAndSelect('challanList.order', 'order');

    if (searchTerm) {
      queryBuilder.where('challanList.challanNo ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      });
    }

    const [challanList, totalCount] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    const totalPages = Math.ceil(totalCount / limit);

    return {
      status: 200,
      totalChallanList: totalCount,
      currentPage: page,
      totalPages,
      message: 'Retrieved challanList successfully',
      data: challanList,
    };
  }

  async findOne(challan: string) {
    const singleChallan = await this.challanListRepository.find({
      where: { challanNo: challan },
    });
    return singleChallan;
  }

  update(id: number, updateChallanListDto: UpdateChallanListDto) {
    return `This action updates a #${id} challanList`;
  }

  remove(id: number) {
    return `This action removes a #${id} challanList`;
  }
}
