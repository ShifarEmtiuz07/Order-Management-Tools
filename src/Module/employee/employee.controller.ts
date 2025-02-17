import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs-extra';
import { extname } from 'path';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeService } from './employee.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'employeeImage', maxCount: 1 },
      { name: 'employeeAvatar', maxCount: 10 },
    ]),
  )
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 900 * 1024, }),
          // new FileTypeValidator({ fileType: /image\/.*/ }),
        ],
        fileIsRequired: false,
      }),
    )
    files: {
      employeeImage?: Express.Multer.File;
      employeeAvatar?: Express.Multer.File[];
    },
  ) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const second = date.getMilliseconds().toString().padStart(2, '0');
    const format = year + month + day + second;

    const employeeAvatar_imgs = [];
    let employee_img = '';
    if (files && files.employeeAvatar) {
      for (const file of files.employeeAvatar) {
        const format = year + month + day + second;
        const ext = extname(file.originalname);

        const baseName = file.originalname.replace(ext, '');
        //const fileName = baseName + '-' + format + ext;
        const fileName =
          createEmployeeDto.name +
          '-' +
          createEmployeeDto.employeeId +
          '-' +
          'avtar' +
          '-' +
          format +
          ext;
        const filePath = `./employeesUpload/${fileName}`;

        await fs.writeFile(filePath, file.buffer);
        employeeAvatar_imgs.push(fileName);
      }
    }

    if (files && files.employeeImage && files.employeeImage[0].originalname) {
      const format = year + month + day + second;

      const ext = extname(files.employeeImage[0].originalname);
      const basename = files.employeeImage[0].originalname.replace(ext, '');
      const fileName =
        createEmployeeDto.name +
        '-' +
        createEmployeeDto.employeeId +
        '-' +
        'profile' +
        '-' +
        format +
        ext;
      //const fileName = basename + '-' + format + ext;
      const filePath = `./employeesUpload/${fileName}`;
      await fs.writeFile(filePath, files.employeeImage[0].buffer);
      employee_img = fileName;
    }

    return this.employeeService.create({
      ...createEmployeeDto,
      employeeImage: employee_img,
      employeeAvatar: employeeAvatar_imgs,
    });
  }

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':employeeId')
  findOne(@Param('employeeId') employeeId: string) {
    return this.employeeService.findOne(employeeId);
  }

  @Patch(':employeeId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'employeeImage', maxCount: 1 },
      { name: 'employeeAvatar', maxCount: 10 },
    ]),
  )
  async update(
    @Param('employeeId') employeeId: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 900 * 1024, }),
          // new FileTypeValidator({ fileType: /image\/.*/ }),
        ],
        fileIsRequired: false,
      }),
    )
    files: {
      employeeImage?: Express.Multer.File;
      employeeAvatar?: Express.Multer.File[];
    },
  ) {
    const employee = await this.employeeService.findOne(employeeId);

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    //if one and only when files && database has employeeImage then delete the database image

    if (files && files.employeeImage && employee.employeeImage) {
      const filePath = `./employeesUpload/${employee.employeeImage}`;

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    //if one and only when files && database has employeeAvatar then delete the database image
    if (files && files.employeeAvatar && employee.employeeAvatar) {
      for (const avatar of employee.employeeAvatar) {
        const avatarPath = `./employeesUpload/${avatar}`;
        if (fs.existsSync(avatarPath)) {
          fs.unlinkSync(avatarPath);
        }
      }
    }

    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const second = date.getMilliseconds().toString().padStart(2, '0');
    const format = year + month + day + second;

    const employeeAvatar_imgs = [];
    let employee_img = '';
    if (files && files.employeeAvatar) {
      for (const file of files.employeeAvatar) {
        const format = year + month + day + second;
        const ext = extname(file.originalname);

        const baseName = file.originalname.replace(ext, '');
        const fileName = baseName + '-' + format + ext;
        const filePath = `./employeesUpload/${fileName}`;

        await fs.writeFile(filePath, file.buffer);
        employeeAvatar_imgs.push(fileName);
      }
    }
    updateEmployeeDto.employeeAvatar = employeeAvatar_imgs.length
      ? employeeAvatar_imgs
      : employee.employeeAvatar;

    if (files && files.employeeImage && files.employeeImage[0].originalname) {
      const format = year + month + day + second;

      const ext = extname(files.employeeImage[0].originalname);
      const basename = files.employeeImage[0].originalname.replace(ext, '');
      const fileName = basename + '-' + format + ext;
      const filePath = `./employeesUpload/${fileName}`;
      await fs.writeFile(filePath, files.employeeImage[0].buffer);
      employee_img = fileName;
    }
    updateEmployeeDto.employeeImage = employee_img
      ? employee_img
      : employee.employeeImage;

    return this.employeeService.update(employeeId, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }

  @Post('forgot-password/send-otp') //send-otp
  async sendEmailAndOtp(@Body('employeeId') employeeId: string) {
    await this.employeeService.generateEmailAndOtp(employeeId);
    return { status: 'success', message: 'Sending email in a moment' };
  }

  @Post('forgot-password/varify-otp/:emplopyeeId') //send-otp
  async verifiedEmailAndOtp(
    @Param('emplopyeeId') employeeId: string,
    @Body('otp') otp: string,
    @Body('password') password: string,
  ) {
    await this.employeeService.verifyEmailAndOtp(employeeId, otp, password);
    return { status: 'success', message: 'Password changed successfully' };
  }
}
