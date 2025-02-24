import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  generateCheckoutNumber,
  generateOrderNumber,
} from 'src/utils/order.util';
import { Repository } from 'typeorm';
import { ProductsService } from './../products/products.service';
import { Product } from '../products/entities/product.entity';
import { Checkout } from './entities/checkout.entity';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(Checkout)
    private readonly checkoutRepository: Repository<Checkout>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productsService: ProductsService,
  ) {}

  async createCheckout(createOrderItemsDto) {
    try {
      const checkoutNumber = generateCheckoutNumber();

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

        // console.log(`subtotal:${subTotal}`);

        item.subTotal = subTotal;
        item.checkoutNumber = checkoutNumber;

        // console.log(`checkoutNumber:${item.checkoutNumber}`);

        const singleOrderitem = await this.checkoutRepository.create({
          ...item,
          subTotal: Math.round(subTotal),
          checkoutNumber: item.checkoutNumber,
          discount: Math.round(discount),
          product: orderItem,
        });
        const savedOrderItem =
          await this.checkoutRepository.save(singleOrderitem);

        // return {
        //   status: 201,
        //   message: 'Checkout created successfully',
        //   result: savedOrderItem,
        // };
      });
      return {
        status: 201,
        message: 'Checkout created successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Checkout creation failed',
      );
    }
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
    result: Checkout[];
  }> {
    try {
      const queryBuilder = await this.checkoutRepository
        .createQueryBuilder('checkout')
        .leftJoinAndSelect('checkout.product','product')
        .orderBy('checkout.createdAt', 'DESC');

      if (searchTerm) {
        queryBuilder.where(
          'checkout.checkoutNumber ILIKE :searchTerm OR checkout.productNameEn ILIKE :searchTerm OR checkout.productNameBn ILIKE :searchTerm',
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

  async find(checkoutNumber: string) {
    const orderItem = await this.checkoutRepository.find({
      where: { checkoutNumber: checkoutNumber },
      relations: ['product'],
    });
    return {
      status: 200,
      message: 'Order item is retrieved successfully!',
      result: orderItem,
    };
  }

  async update(id: number, updateOrderItemsDto) {
    if (updateOrderItemsDto.productQuantity < 1) {
      return await this.checkoutRepository.delete(id);
    }

    const orderItem = await this.checkoutRepository.findOne({
      where: { id: id },
      relations: ['product'],
    });
    // console.log(orderItem);
    //

    const orderProduct = await this.productRepository.findOne({
      where: { productCode: orderItem.productCode },
    });
    // console.log(orderProduct);

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

    // console.log(`subtotal:${subTotal}`);

    updateOrderItemsDto.subTotal = Math.floor(subTotal);

    Object.assign(orderItem, updateOrderItemsDto);

    const updatedOrderItems = await this.checkoutRepository.save(orderItem);
    return {
      status: 200,
      message: 'Order items were updated!',
      result: updatedOrderItems,
    };
  }
}
