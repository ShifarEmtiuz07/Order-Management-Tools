import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { generateOrderNumber } from '../../utils/order.util';
import { ProductsService } from '../products/products.service';
import { Checkout } from '../checkout/entities/checkout.entity';
import { CheckoutService } from '../checkout/checkout.service';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Checkout)
    private readonly checkoutRepository: Repository<Checkout>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productsService: ProductsService,
    private readonly checkoutService: CheckoutService,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    try {
      const checkoutNumber = createOrderDto.checkoutNumber;
      //console.log(checkoutNumber);
      const orders = await this.checkoutRepository.find({
        where: { checkoutNumber },
        relations: ['order'],
      });

      //console.log(orders);
      let checkoutProducts: Checkout[] = [];
      let totalOrderPrice: number = 0;

      for (const order of orders) {
        totalOrderPrice = totalOrderPrice + order.subTotal;
        checkoutProducts.push(order);
      }
      //console.log(checkoutProducts);

      const totalPurchesAmount =
        totalOrderPrice + createOrderDto.deliveryCharge;

      const orderNumber = await generateOrderNumber();

      const orderEntity = await this.orderRepository.create({
        ...createOrderDto,
        totalOrderPrice,
        totalPurchesAmount,

        orderNumber,
        checkout: checkoutProducts,
      });
      // console.log(orderEntity);
      const savedOrder = await this.orderRepository.save(orderEntity);
      return savedOrder;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Order creation failed',
      );
    }
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: ['employee', 'checkout'],
    });
  }

  async findOne(orderNumber: string) {
    try {
      const order = await this.orderRepository.findOne({
        where: { orderNumber: orderNumber },
        relations: [
          'employee',
          'customer',
          'checkout',
          'transaction',
          'requisition',
        ],
        select: {
          employee: {
            employeeId: true,
            name: true,
            phone: true,
          },
          customer: {
            id: true,
            customerId: true,
            firstName: true,
            lastName: true,
            phone: true,
            address: true,
            shippingAddress: true,
          },
          checkout: {
            id: true,
            checkoutNumber: true,
          },
          transaction: {
            transactionNumber: true,
            orderNumber: true,
          },
        },
      });

      return order;
    } catch (error) {
      throw new NotFoundException(
        error.message || `Order ${orderNumber} not found`,
      );
    }
  }

  async update(orderNumber: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.orderRepository.find({
        where: { orderNumber: orderNumber },
      });

      Object.assign(orderNumber, updateOrderDto);

      return await this.orderRepository.save(order);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(orderNumber: string) {
    try {
      const order = await this.orderRepository.find({
        where: { orderNumber: orderNumber },
      });

      return await this.orderRepository.remove(order);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
