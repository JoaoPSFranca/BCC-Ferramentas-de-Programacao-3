import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsNumber,
    Min
} from 'class-validator';

export class DepositoDto {
    @IsNumber()
    @Type(() => Number) 
    @IsNotEmpty({ message: "O valor não pode ser vazio" })
    @Min(0.01, { message: 'O valor deve ser maior que zero' })
    valor: number;
}