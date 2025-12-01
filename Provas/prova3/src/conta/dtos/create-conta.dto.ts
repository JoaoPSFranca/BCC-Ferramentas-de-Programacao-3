import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsOptional,
    MinLength
} from 'class-validator';

export class CreateContaDto {
    @IsString()
    @MaxLength(100)
    @IsNotEmpty({ message: 'O nome não pode ser vazio. ' })
    nome: string;

    @IsNotEmpty({ message: "O email não pode ser vazio. " })
    @IsString()
    @MaxLength(100)
    email: string;

    @MinLength(6)
    @IsNotEmpty({ message: "A senha não pode ser vazia. " })
    senha: string;

    @IsOptional()
    saldo: number;
}