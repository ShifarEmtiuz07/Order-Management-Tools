import { Injectable } from '@nestjs/common';
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

      // orders.map((order) => {

      //   checkoutProducts.push(order);

      //   //console.log(order);
      // });

      let totalOrderPrice: number = 0;
      // orders.map((order) => {
      //   totalOrderPrice = totalOrderPrice + order.subTotal;

      // });

      for (const order of orders) {
        totalOrderPrice = totalOrderPrice + order.subTotal;
        checkoutProducts.push(order);
      }
      //console.log(checkoutProducts);
      //console.log(` aa: ${allProducts}`)

      const totalPurchesAmount =
        totalOrderPrice + createOrderDto.deliveryCharge;
      const dueAmount = totalPurchesAmount - createOrderDto.paidAmount;
      if (totalPurchesAmount > createOrderDto.paidAmount) {
        createOrderDto.paymentStatus = 'partial';
      } else if (totalPurchesAmount === createOrderDto.paidAmount) {
        createOrderDto.paymentStatus = 'paid';
      }
      const orderNumber = await generateOrderNumber();

      const orderEntity = await this.orderRepository.create({
        ...createOrderDto,
        totalOrderPrice,
        totalPurchesAmount,
        dueAmount,
        orderNumber,
        checkout: checkoutProducts,
      });
      console.log(orderEntity);
      const savedOrder = await this.orderRepository.save(orderEntity);
      return savedOrder;
    } catch (error) {
      console.log(error.message);
    }
  }

async  findAll() {
  // console.log('from api')
    return await this.orderRepository.find({relations:['employee','checkout']});
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
