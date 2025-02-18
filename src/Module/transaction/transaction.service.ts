import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../order/entities/order.entity';
import { generateTransactionNumber } from 'src/utils/order.util';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository:Repository<Transaction>,
    @InjectRepository(Order)
    private readonly orderRepository:Repository<Order>

  ){}
 async create(createTransactionDto: CreateTransactionDto) {

  try{
    const orderNumber= createTransactionDto.orderNumber;
    // console.log(orderNumber)
    
    
   const order= await this.orderRepository.findOne({where:{orderNumber}})
  //  console.log(order)

   if(!order){
    throw new NotFoundException(`${order.orderNumber} not found`)
   }
   let paymentStatus:string;
   const totalPurchesAmount= order.totalPurchesAmount;

   const dueAmount = order.totalPurchesAmount - createTransactionDto.paidAmount;
   if (order.totalPurchesAmount > createTransactionDto.paidAmount) {
    paymentStatus = 'partial';
  } else if (order.totalPurchesAmount === createTransactionDto.paidAmount) {
   paymentStatus = 'paid';
  }
  const transactionNumber=generateTransactionNumber();
  const transactionEntity= this.transactionRepository.create({
    ...createTransactionDto,
    totalPurchesAmount,
    dueAmount,
    transactionNumber,
    paymentStatus,
    order
  });

  const savedTransactionNumber=await this.transactionRepository.save(transactionEntity)
  return savedTransactionNumber;
  }
  catch(error){
    throw new InternalServerErrorException(error.message||'Transaction creation failed')
  }
 

   
    //return 'This action adds a new transaction';
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
