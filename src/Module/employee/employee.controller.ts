import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  ParseFilePipe,
  UseInterceptors,
  UploadedFiles,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { extname } from 'path';
import * as fs from 'fs-extra';

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
    console.log(format);

    const employeeAvatar_imgs = [];
    let employee_img = '';
    if (files.employeeAvatar) {
      for (const file of files.employeeAvatar) {
        const format = year + month + day + second;
        const ext = extname(file.originalname);
        // console.log(ext)
        const baseName = file.originalname.replace(ext, '');
        const fileName = baseName + '-' + format + ext;
        // console.log(fileName);
        const filePath = `./employeesUpload/${fileName}`;
        // console.log(filePath);
        await fs.writeFile(filePath, file.buffer);
        employeeAvatar_imgs.push(fileName);
      }
    }
    if (files.employeeImage && files.employeeImage.originalname) {
      const format = year + month + day + second;
      console.log(format)
      const ext = extname(files.employeeImage.originalname);
      const basename = files.employeeImage.originalname.replace(ext, '');
      const fileName = basename + '-' + format + ext;
      const filePath = `./employeesUpload/${fileName}`;
      await fs.writeFile(filePath, files.employeeImage.buffer);
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
  update(
    @Param(':employeeId') employeeId: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(employeeId, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
