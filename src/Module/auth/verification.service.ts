import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OtpToken } from './entities/otpToken.entity';
import { MoreThan, Repository } from 'typeorm';
import { generateOtp } from 'src/utils/otp.util';

@Injectable()
export class VerificationService {
  private readonly minRequestIntervalMinutes = 1;
  private readonly tokenExpirationMinutes = 15;
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(OtpToken)
    private readonly otpRepository: Repository<OtpToken>,
  ) {}

  async generateOtp(employeeId: string, size: number = 6) {
    //Promise<string>

    const now = new Date();

    const recentToken = await this.otpRepository.findOne({
      where: {
        employeeId,
        createdAt: MoreThan(
          new Date(now.getTime() - this.minRequestIntervalMinutes * 60 * 1000),
        ),
      },
    });

    if (recentToken) {
      throw new UnprocessableEntityException(
        'Please wait a minute before requesting a new token.',
      );
    }
    const otp = generateOtp(size);
  }
}
