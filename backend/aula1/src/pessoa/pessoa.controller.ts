/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { PessoaService } from './pessoa.service';
import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { Pessoa } from './pessoa.entity';

@Controller('pessoa')
export class PessoaController {
    constructor(private pessoaService: PessoaService){}

    private pessoas: any[] = [];

    @Get("")
    teste() {
        return {
        message: "Todas as Pessoas",
        };
    }

    @Get("buscar/:id")
    obterPorId(@Param("id") id: number) {
        console.log(id);
        return {
        message: `Pessoa com id: ${id}`,
        };
    }

    @Get("ordem/descendente")
    obterTodasOrdenadasDescendente() {
        return {
        message: "Pessoas ordenadas descendente",
        };
    }
    
    @Get("nome")
    buscarPeloNome(@Query('nome') nome: string) {
        return {
        message: `Obter pelo nome ${nome}`
        };
    }

    @Get("nome/ordenado")
    buscarPeloNomeOrdenado(@Query('nome') nome: string,@Query('order') order: string){
        return{
        message: `Obter pelo nome ${nome} e order ${order}`
        };
    }

    @Get("/nome/:nome")
    obterPeloNome(@Param('nome') nome: string){
        if (nome) {
            return this.pessoaService.search(nome);
        }
    }

    @Post()
    inserir(@Body() body: any){
        console.log(body);
        
        const pessoa: Partial<Pessoa> = {
            nome: body.nome,
            email: body.email
        }

        return this.pessoaService.insert(pessoa); 
    }
}
