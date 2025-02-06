import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import * as bcrypt from 'bcryptjs';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'dns';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {

    try{
      const password = createEmployeeDto.password;
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      createEmployeeDto.password = hashedPassword;
      const employee = await this.employeeRepository.create(createEmployeeDto);
      const savedeEmployee = await this.employeeRepository.save(employee);
      console.log(savedeEmployee);
      return savedeEmployee;
    }catch(error){
      throw new InternalServerErrorException(error.message||"Failed to create employee")
    }
   
  }

  async findAll(): Promise<Employee[]> {

    try{   
      const allEmployees = this.employeeRepository.find();
      return allEmployees;
    }
      catch(error){
        throw new InternalServerErrorException(error.message||'Failed to find all employees')
    }
 
  }

  async findOne(employeeId: string): Promise<Employee> {
    try{
      const employee = await this.employeeRepository.findOne({
        where: { employeeId },
      });
      console.log(employee);
  
      return employee;
    }catch(error){
      throw new InternalServerErrorException(error.message||`Failed to find employee with ID ${employeeId}`)
    }

  }

  async update(employeeId: string, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const employee = await this.employeeRepository.findOne({
        where: { employeeId },
      });
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${employeeId} not found`);
      }
      Object.assign(employee, updateEmployeeDto);
      const updatedUser = await this.employeeRepository.save(employee);
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update employee with ID ${employeeId}` || error.message,
      );
    }

   
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
