import { OrderItem } from 'src/Module/order/entities/orderItems.entity';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateOrderNumber } from 'src/utils/order.util';
import { Repository } from 'typeorm';
import { ProductsService } from './../products/products.service';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
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
    try {
      const queryBuilder = await this.orderItemRepository
        .createQueryBuilder('orderItem')
        .orderBy('orderItem.createdAt', 'DESC');

      if (searchTerm) {
        queryBuilder.where(
          'orderItem.orderNumber ILIKE :searchTerm OR orderItem.productNameEn ILIKE :searchTerm OR orderItem.productNameBn ILIKE :searchTerm',
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
        message: 'Order items are retrieved successfully!',
        result: orderItem,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Order items were not retrieved!',
      );
    }
  }

  async findOne(orderNumber: string) {
    const orderItem = await this.orderItemRepository.find({
      where: { orderNumber: orderNumber },
    });
    return {
      status: 200,
      message: 'Order item is retrieved successfully!',
      result: orderItem,
    };
  }

  async update(id: number, updateOrderItemsDto) {
    if (updateOrderItemsDto.productQuantity < 1) {
      return await this.orderItemRepository.delete(id);
    }

    const orderItem = await this.orderItemRepository.findOne({
      where: { id: id },
      relations: ['productCode'],
    });
    console.log(orderItem);
    //

    const orderProduct = await this.productRepository.findOne({
      where: { productCode: orderItem.productCode.productCode },
    });
    console.log(orderProduct);
    // const orderItem = await this.productsService.findOne();
    let singleItemPrice: number, discount: number;

    if (orderProduct.discount) {
      if (orderProduct.discountType == 'taka') {
        singleItemPrice = orderProduct.price - orderProduct.discount;
        updateOrderItemsDto.discount = Math.floor(orderItem.discount);
      } else if (orderProduct.discountType == 'percentage') {
        const singleItemDiscount: number =
          orderProduct.price * (orderProduct.discount / 100);

        singleItemPrice = orderProduct.price - singleItemDiscount;
        updateOrderItemsDto.discount = Math.floor(
          singleItemDiscount * updateOrderItemsDto.productQuantity,
        );
      }
    }
    const subTotal = orderProduct.discount
      ? singleItemPrice * updateOrderItemsDto.productQuantity
      : orderProduct.price * updateOrderItemsDto.productQuantity;

    console.log(`subtotal:${subTotal}`);

    updateOrderItemsDto.subTotal = Math.floor(subTotal);

    Object.assign(orderItem, updateOrderItemsDto);

    const updatedOrderItems = await this.orderItemRepository.save(orderItem);
    return {
      status: 200,
      message: 'Order items were updated!',
      result: updatedOrderItems,
    };
  }
}
