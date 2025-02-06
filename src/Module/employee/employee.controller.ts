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
import * as path from 'path';
import { extname } from 'path';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeService } from './employee.service';

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
    if (files.employeeAvatar) {
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

    if (files.employeeImage && files.employeeImage[0].originalname) {
      const format = year + month + day + second;

      const ext = extname(files.employeeImage[0].originalname);
      const basename = files.employeeImage[0].originalname.replace(ext, '');
      const fileName = basename + '-' + format + ext;
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
      }),
    )
    files: {
      employeeImage?: Express.Multer.File;
      employeeAvatar?: Express.Multer.File[];
    },
  ) {
    console.log(employeeId)
    const employee = await this.employeeService.findOne(employeeId);
    console.log(employee)
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    if (employee.employeeImage) {
      const imagePath = path.resolve(employee.employeeImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    if (employee.employeeAvatar && Array.isArray(employee.employeeAvatar)) {
      for (const avatar of employee.employeeAvatar) {
        const avatarPath = path.resolve(avatar);
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
    if (files.employeeAvatar) {
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
    updateEmployeeDto.employeeAvatar = employeeAvatar_imgs;

    if (files.employeeImage && files.employeeImage[0].originalname) {
      const format = year + month + day + second;

      const ext = extname(files.employeeImage[0].originalname);
      const basename = files.employeeImage[0].originalname.replace(ext, '');
      const fileName = basename + '-' + format + ext;
      const filePath = `./employeesUpload/${fileName}`;
      await fs.writeFile(filePath, files.employeeImage[0].buffer);
      employee_img = fileName;
      updateEmployeeDto.employeeImage = employee_img;
      
    }
    const emID=employeeId

    return this.employeeService.update(employeeId, {...updateEmployeeDto,employeeId:emID});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
