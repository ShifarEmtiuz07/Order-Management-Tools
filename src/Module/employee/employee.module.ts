import { VerificationService } from '../auth/services/verification.service';
import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { OtpToken } from '../auth/entities/otpToken.entity';
import { EmailService } from '../auth/services/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, OtpToken])],
  controllers: [EmployeeController],
  providers: [EmployeeService, VerificationService,EmailService],
})
export class EmployeeModule {}
