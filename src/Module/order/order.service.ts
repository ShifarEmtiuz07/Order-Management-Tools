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
    const orderNumber = createOrderDto.orderNumber;
    console.log(orderNumber);
    const orders = await this.checkoutService.findOne(orderNumber);
    console.log(orders);
    // orders.map(()=>{

    // })
    let allProducts=[];
    let totalOrderPrice: number;
    orders.result.map((order) => {
      totalOrderPrice = totalOrderPrice + order.subTotal;
      allProducts.push(order.productCode.productCode);
    });

    const totalPurchesAmount = totalOrderPrice + createOrderDto.deliveryCharge;
    const dueAmount = totalPurchesAmount - createOrderDto.paidAmount;
    if (totalPurchesAmount > createOrderDto.paidAmount) {
      createOrderDto.paymentStatus = 'partial';
    } else if (totalPurchesAmount === createOrderDto.paidAmount) {
      createOrderDto.paymentStatus = 'paid';
    }

    const orderEntity = await this.orderRepository.create({
      ...createOrderDto,
      totalOrderPrice,
      totalPurchesAmount,
      dueAmount,
      checkout: allProducts,
    });
    const savedOrder = await this.orderRepository.save(orderEntity);
    return savedOrder;
  }

  findAll() {
    return `This action returns all order`;
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
