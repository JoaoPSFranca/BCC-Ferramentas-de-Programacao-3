import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conta } from './entities/conta.entity';
import { Repository } from 'typeorm';
import { CreateContaDto } from './dtos/create-conta.dto';

@Injectable()
export class ContaService {
    constructor(
        @InjectRepository(Conta)
        private contaRepository: Repository<Conta>
    ) { }

    public inserir(conta: CreateContaDto) {
        conta.saldo = 0.00;
        return this.contaRepository.save(conta);
    }

    public login(email: string, senha: string) {
        return this.contaRepository.findOneBy({ email, senha });
    }

    public balance(id: string) {
        return this.contaRepository.findOne({
            select: {
                saldo: true,
            },
            where: {
                id
            }
        });
    }

    public async deposit(id: string, value: number) {
        let conta = await this.contaRepository.findOneBy({ id });
        if (!conta) return new NotFoundException();

        let saldo = (+conta.saldo);
        saldo += +value;

        conta.saldo = saldo;
        this.contaRepository.save(conta);

        return {
            "message": "Depósito realizado com sucesso.",
            "newBalance": conta.saldo
        };
    }

    public async withdraw(id: string, value: number) {
        let conta = await this.contaRepository.findOneBy({ id });
        if (!conta) return new NotFoundException();

        if (+value > +conta.saldo) {
            return {
                "message": "Saque não realizado, saldo insuficiente. ",
            }
        }

        conta.saldo -= +value;
        this.contaRepository.save(conta);

        return {
            "message": "Saque realizado com sucesso.",
            "newBalance": +conta.saldo.toPrecision(2)
        };
    }
}
