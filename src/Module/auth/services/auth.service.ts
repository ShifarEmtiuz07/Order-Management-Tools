import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { UpdateAuthDto } from '../dto/update-auth.dto';
import { Repository } from 'typeorm';
import { OtpToken } from '../entities/otpToken.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Auth } from '../entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    // try{
    //   const user = this.authRepository.create(createAuthDto);
    //   return this.authRepository.save(user);
    //   // console.log(savedUser)
    //   // return savedUser
    // }catch(error){
    //   throw new InternalServerErrorException(error.message|| 'Failed to save user')
    // }
  }

  async logIn(
    createAuthDto,
    res,
  ): Promise<{ access_token: string; refresh_token: string }> {
    //: Promise<{ access_token: string }>
    try {
      const user = this.findOne(createAuthDto.userName);

      if ((await user)?.password !== createAuthDto.password) {
        throw new UnauthorizedException();
      }

      const payload = {
        sub: (await user).id,
        userName: (await user).userName,
        role: (await user).role,
      };

      const access_token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '1hr',
      });
      const refresh_token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '3days',
      });

      res.cookie('accessToken', access_token, {
        httpOnly: true,
        maxAge: 7 * 60 * 60 * 1000,
      });

      res.status(200).send({
        message: 'Login successful.',
        access_token,
        refresh_token,
      });

      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to save user',
      );
    }
  }

  async findAll() {
    return await this.authRepository.find();
  }

  async findOne(userName: string) {
    const user = await this.authRepository.findOne({ where: { userName } });

    return user;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
