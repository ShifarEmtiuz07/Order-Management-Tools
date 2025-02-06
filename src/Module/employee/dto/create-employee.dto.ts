import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/enum/role.enum';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsEmail()
  email: string;
  @IsString()
  PresentAddress: string;
  @IsString()
  PermanentAddress: string;
  @IsString()
  nationalId: string;
  @IsString()
  birthDate: Date;
  @IsString()
  gender: string;
  @IsString()
  bloodGroup: string;
  @IsString()
  dateOfJoining: Date;
  @IsString()
  department: string;
  @IsString()
  designation: string;
  @IsString()
  reportingManager: string;
  @IsString()
  employeeStatus: string;
  @IsString()
  employeeImage: string;
  @IsString()
  employeeAvatar: string[];
  @IsString()
  password: string;

  @IsBoolean()
  isActive: boolean;

  @IsNotEmpty()
  role: UserRole;
}
