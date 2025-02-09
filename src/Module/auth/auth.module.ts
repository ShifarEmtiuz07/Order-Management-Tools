import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { OtpToken } from './entities/otpToken.entity';
import { Employee } from '../employee/entities/employee.entity';
import { VerificationService } from './services/verification.service';
import { EmailService } from './services/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, OtpToken, Employee]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // secret: configService.get<string>('JWT_SECRET'),
        // signOptions: { expiresIn: '1h' }, // Example expiration
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, VerificationService,EmailService],
  exports: [AuthService, JwtModule, VerificationService,EmailService],
})
export class AuthModule {}
