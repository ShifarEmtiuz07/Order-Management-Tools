import { IsNumber, IsString } from "class-validator";

export class CreateTransactionDto {
    @IsString()
    orderNumber:string;
    @IsNumber()
    paidAmount:number;
    
}
