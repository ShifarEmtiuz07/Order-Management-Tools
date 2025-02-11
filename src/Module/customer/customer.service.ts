import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      const totalCustomer = (await this.customerRepository.count()) + 1;
      const num = totalCustomer.toString().padStart(3, '0');

      const customerId = createCustomerDto.firstName + '-' + num;

      const customer = await this.customerRepository.create({
        ...createCustomerDto,
        customerId: customerId,
      });
      const savedCustomer = await this.customerRepository.save(customer);
      return savedCustomer;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Customer did not create',
      );
    }
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id: id },
    });

    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    try {
      const customer = await this.customerRepository.findOne({
        where: { id: id },
      });
      Object.assign(customer, updateCustomerDto);
      const updatedCustomer = await this.customerRepository.save(customer);
      return updatedCustomer;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    const customer = await this.customerRepository.findOne({
      where: { id: id },
    });

    return await this.customerRepository.remove(customer);
  }
}


