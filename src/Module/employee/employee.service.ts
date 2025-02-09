import { verify } from 'crypto';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { OtpToken } from '../auth/entities/otpToken.entity';
import { VerificationService } from '../auth/services/verification.service';
import { EmailService } from '../auth/services/email.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(OtpToken)
    private readonly otpRepository: Repository<OtpToken>,

    private readonly verificationService: VerificationService,
    private readonly emailService: EmailService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    try {
      const password = createEmployeeDto.password;
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      createEmployeeDto.password = hashedPassword;
      const employee = await this.employeeRepository.create(createEmployeeDto);
      const savedeEmployee = await this.employeeRepository.save(employee);
      return savedeEmployee;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to create employee',
      );
    }
  }

  async findAll(): Promise<Employee[]> {
    try {
      const allEmployees = this.employeeRepository.find();
      (await allEmployees).map((employee) => {
        delete employee.password;
      });
      return allEmployees;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to find all employees',
      );
    }
  }

  async findOne(employeeId: string): Promise<Employee> {
    try {
      const employee = await this.employeeRepository.findOne({
        where: { employeeId },
      });

      if (!employee) {
        throw new NotFoundException(`Employee with ID ${employeeId} not found`);
      }
      delete employee.password;

      return employee;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || `Failed to find employee with ID ${employeeId}`,
      );
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

  //generate otp
  async generateEmailAndOtp(employeeId: string) {
    const employee = await this.findOne(employeeId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    const otp = await this.verificationService.generateOtp(employeeId);
    // console.log(otp);

    this.emailService.sendEmail({
      subject: 'MyApp - Account Verification',
      recipients: [{ name: employee.name ?? '', address: employee.email }],
      html: `<p>Hi${employee.name ? ' ' + employee.name : ''},</p><p>You may verify your MyApp account using the following OTP: <br /><span style="font-size:24px; font-weight: 700;">${otp}</span></p><p>Regards,<br />MyApp</p>`,
    });
  }
  //varify otp
  async verifyEmailAndOtp(employeeId: string, otp: string, password: string) {
    const invalidMessage = 'Invalid or expired OTP';

    const employee = await this.employeeRepository.findOne({
      where: { employeeId },
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    const isvalid = this.verificationService.verifyOtp(otp, employeeId);
    if (!isvalid) {
      throw new UnprocessableEntityException(invalidMessage);
    }
    try {
      employee.isActive = true;
      const salt = bcrypt.genSaltSync(10);
      const hasedpassword = await bcrypt.hash(password, salt);
      employee.password = hasedpassword;
      //console.log(employee.password)
      await this.employeeRepository.save(employee);
      return true;
    } catch (error) {
      return error.message || 'password do not changed';
    }
  }
}
