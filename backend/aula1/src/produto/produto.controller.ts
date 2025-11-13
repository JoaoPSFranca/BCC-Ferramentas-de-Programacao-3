/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Produto } from './produto.entity';
import { ProdutoService } from './produto.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('produto')
export class ProdutoController {

    constructor(private produtoService: ProdutoService) {}

    @Get("")
    welcome() {
        return {
            message: "Bem vindo a pagina de Produtos"
        }
    }

    @Post("")
    insert(@Body() body: any) {
        
        const prod: Partial<Produto> = {
            nome: body.nome,
            preco: body.preco,
            quantidade: body.quantidade,
            minimo: body.minimo,
            status: body.status,
            categoria: body.categoria
        }

        return this.produtoService.insert(prod);
    }

    @Get("/search/all")
    getAll() {
        return this.produtoService.searchAll();
    }

    @Get("/search/name/:name")
    getByName(@Param('name') name: string){
        if (name)
            return this.produtoService.searchByName(name);
    }

    @Get("/search/id/:id")
    getById(@Param('id') id: string){
        if (id) 
            return this.produtoService.searchById(id);
    }

    @Get("/search/categoria/:cat")
    getByCategoria(@Param('cat') cat: number) {
        if (cat)
            return this.produtoService.searchByCat(cat);
    }
}
