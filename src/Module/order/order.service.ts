import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/orderItems.entity';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import  {generateOrderNumber} from '../../utils/order.util'
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productsService: ProductsService
  ) {}
  create(createOrderDto: CreateOrderDto) {}

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
  async createCheckout(createOrderItemsDto) {
    const orderNumber = generateOrderNumber();

    createOrderItemsDto.map(async (item) => {
      const orderItem = await this.productsService.findOne(item.productCode);
      let singleItemPrice:number,discount:number;

      if (orderItem.discount) {
        if (orderItem.discountType == 'taka') {
          singleItemPrice = orderItem.price - orderItem.discount;
          discount=orderItem.discount
          
        } else if (orderItem.discountType == 'percentage') {
          const singleItemDiscount:number =( orderItem.price * (orderItem.discount / 100));
           
          singleItemPrice = orderItem.price - singleItemDiscount;
          discount=singleItemDiscount* item.productQuantity
          
        }
      }
      const subTotal = orderItem.discount
        ? singleItemPrice * item.productQuantity
        : orderItem.price * item.productQuantity;

      console.log(`subtotal:${subTotal}`)

      item.subTotal = subTotal;
      item.orderNumber = orderNumber;

      console.log(`orderNumber:${ item.orderNumber}`)


      const singleOrderitem = await this.orderItemRepository.create({
        ...item,
        subTotal: Math.round(subTotal),
        orderNumber: item.orderNumber,
        discount:Math.round(discount)
        
      });
      const savedOrderItem =
        await this.orderItemRepository.save(singleOrderitem);
    });

    // const  =
    //   await this.orderItemRepository.create(createOrderItemsDto);
    // const savedOrderItem = await this.orderItemRepository.save(orderItem);
    // return savedOrderItem;
  }
}
