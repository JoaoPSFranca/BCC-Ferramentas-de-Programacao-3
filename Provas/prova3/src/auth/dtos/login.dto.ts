import { 
    IsNotEmpty, 
    IsString, 
    MaxLength, 
    MinLength 
} from "class-validator";

export class LoginDto {
    @IsString()
    @MaxLength(100)
    @IsNotEmpty({ message: "O email não pode ser vazio. " })
    email: string;

    @MinLength(6)
    @IsNotEmpty({ message: "A senha não pode ser vazia. " })
    senha: string;
}