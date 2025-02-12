import { OrderItem } from 'src/Module/order/entities/orderItems.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateOrderNumber } from 'src/utils/order.util';
import { Repository } from 'typeorm';
import { ProductsService } from './../products/products.service';


@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly productsService: ProductsService,
  ) {}

  async createCheckout(createOrderItemsDto) {
    const orderNumber = generateOrderNumber();

    createOrderItemsDto.map(async (item) => {
      const orderItem = await this.productsService.findOne(item.productCode);
      let singleItemPrice: number, discount: number;

      if (orderItem.discount) {
        if (orderItem.discountType == 'taka') {
          singleItemPrice = orderItem.price - orderItem.discount;
          discount = orderItem.discount;
        } else if (orderItem.discountType == 'percentage') {
          const singleItemDiscount: number =
            orderItem.price * (orderItem.discount / 100);

          singleItemPrice = orderItem.price - singleItemDiscount;
          discount = singleItemDiscount * item.productQuantity;
        }
      }
      const subTotal = orderItem.discount
        ? singleItemPrice * item.productQuantity
        : orderItem.price * item.productQuantity;

      console.log(`subtotal:${subTotal}`);

      item.subTotal = subTotal;
      item.orderNumber = orderNumber;

      console.log(`orderNumber:${item.orderNumber}`);

      const singleOrderitem = await this.orderItemRepository.create({
        ...item,
        subTotal: Math.round(subTotal),
        orderNumber: item.orderNumber,
        discount: Math.round(discount),
      });
      const savedOrderItem =
        await this.orderItemRepository.save(singleOrderitem);
    });

    // const  =
    //   await this.orderItemRepository.create(createOrderItemsDto);
    // const savedOrderItem = await this.orderItemRepository.save(orderItem);
    // return savedOrderItem;
  }

  async getCheckout(
    page: number,
    limit: number,
    searchTerm: string,
  ): Promise<{
    status: number;
    page: number;
    totalPages: number;
    totalCount: number;
    message: string;
    result: OrderItem[];
  }> {
    const queryBuilder = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .orderBy('orderItem.createdAt', 'DESC');

    if (searchTerm) {
      queryBuilder.where(
        'orderItem.orderNumber ILIKE :=searchTerm OR orderItem.productNameEn ILIKE :=searchTerm OR orderItem.productNameBn ILIKE :=searchTerm',
        { searchTerm: `%${searchTerm}%` },
      );
    }

    const [orderItem, totalCount] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    const totalPages = Math.ceil(totalCount / limit);

    return {
      status: 200,
      page,
      totalPages,
      totalCount,
      message: 'Order items are retrieved successfully',
      result: orderItem,
    };

    // const [orderitem,totalCount] = await this.orderItemRepository.findAndCount({take:limit,skip:(page-1)*limit});
    // console.log(orderitem);
    // return {
    //   status: 200,
    //   message: 'Order items are retrieved successfully',
    //   result: orderitem,
    // };
  }

  async findOne(orderNumber: string) {
    const orderItem = await this.orderItemRepository.find({
      where: { orderNumber: orderNumber },
    });
    return orderItem;
  }

  async update(orderNumber: string, UpdateOrderItemsDto) {
    const orderItems=await this.orderItemRepository.find({ where: { orderNumber: orderNumber },})
    
  }
}
