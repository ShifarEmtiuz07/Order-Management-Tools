import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { generateOtp } from 'src/utils/otp.util';
import { MoreThan, Repository } from 'typeorm';
import { OtpToken } from './entities/otpToken.entity';
import { verify } from 'crypto';

@Injectable()
export class VerificationService {
  private readonly minRequestIntervalMinutes = 1;
  private readonly tokenExpirationMinutes = 15;

  constructor(
    @InjectRepository(OtpToken)
    private readonly otpRepository: Repository<OtpToken>,
  ) {}

  async generateOtp(employeeId: string, size: number = 6):Promise<string> {
    //

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
    const salt = bcrypt.genSaltSync(10);
    const hasedOtp = bcrypt.hashSync(otp, salt);

    const tokenEntity= await this.otpRepository.create({
      employeeId,
      otp:hasedOtp,
      expiresAt: new Date(
        now.getTime() + this.tokenExpirationMinutes*60*1000,
      )

    })
  
  await this.otpRepository.delete({employeeId});
  await this.otpRepository.save(tokenEntity)
  return otp;
}

async verifyOtp(otp:string,employeeId:string):Promise<boolean>{

  const validOtp= await this.otpRepository.findOne({where:{employeeId,
    expiresAt:MoreThan(new Date())} 
  })

  if(validOtp && bcrypt.compare(otp,validOtp))
  {
    await this.otpRepository.remove(validOtp)
    return true;

  }else{
    return false;
  }
}
}
