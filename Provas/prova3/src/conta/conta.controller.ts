import { Body, Controller, Get, Post, Put, Request, RequestMapping, UseGuards } from '@nestjs/common';
import { ContaService } from './conta.service';
import { CreateContaDto } from './dtos/create-conta.dto';
import { Conta } from './entities/conta.entity';
import { AuthGuard } from '../auth/auth.guard';
import { DepositoDto } from './dtos/deposito.dto';

@Controller()
export class ContaController {
    constructor(private contaService: ContaService) {}
    
    @Post('/auth/register')
    register(@Body() corpo: CreateContaDto) {
        const c: Conta = this.contaService.inserir(corpo) as unknown as Conta;
        return c;
    }

    @Get('/account/balance')
    @UseGuards(AuthGuard)
    getBalance(@Request() req){
        return this.contaService.balance(req.acc.sub);
    }

    @Put('/account/deposit')
    @UseGuards(AuthGuard)
    deposit(@Request() req, @Body() depositoDto: DepositoDto) {
        console.log("req acc: ", req.acc);
        console.log("deposito dto: ", depositoDto);
        return this.contaService.deposit(req.acc.sub, depositoDto.valor);
    }

    @Put('/account/withdraw')
    @UseGuards(AuthGuard)
    withdraw(@Request() req, @Body() depositoDto: DepositoDto) {
        return this.contaService.withdraw(req.acc.sub, depositoDto.valor);
    }
}
