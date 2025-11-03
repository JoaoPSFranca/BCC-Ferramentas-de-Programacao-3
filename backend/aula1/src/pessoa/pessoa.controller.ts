/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('pessoa')
export class PessoaController {
    @Get()
    getHello(): string {
        return 'Pessoas';
    }

    @Get('buscar/:id')
    obterPorId(@Param('id') id: string): string {
        return `This action returns a #${id} cat`;
    }

    @Get('todos/descendente')
    obterTodasOrdenadaDescendente() {
        return {
            message: 'Pessoas Ordenadas Descendente',
        };
    }

    @Get('buscar')
    buscarPeloNomeOrdenado(@Query("nome") nome: string, @Query("ordem") ordem: string){
        if (nome && ordem)
            return { message: `Obter pelo nome ${nome} e pela ordem ${ordem}` };
        else if (!nome && ordem)
            return { message: `Obter pela ordem ${ordem}` };
        else if (nome && !ordem)
            return { message: `Obter pelo nome ${nome}` };
        else 
            return { message: `Nenhum parametro encontrado` };
    }

    @Get('buscar')
    buscarPeloNome(@Query("nome") nome: string){
        return {
            message: `Obter pelo nome ${nome}`
        };
    }
}
