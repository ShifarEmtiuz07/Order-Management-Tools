import { IsString } from 'class-validator';
export class CreateChallanListDto {
  @IsString()
  requisitionNumber: string;
  @IsString()
  dispatchhub: string;

  @IsString()
  employeeId: string;
}
