/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Categoria } from './categoria.entity';
import { CategoriaService } from './categoria.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('categoria')
export class CategoriaController {
    constructor(private categoriaService: CategoriaService) {}

    @Get("")
    welcome() {
        return {
            message: "Bem vindo a pagina de Categorias"
        }
    }

    @Post("")
    insert(@Body() body: any) {
        
        const cat: Partial<Categoria> = {
            nome: body.nome
        }

        return this.categoriaService.insert(cat);
    }

    @Get("/search/all")
    getAll() {
        return this.categoriaService.searchAll();
    }

    @Get("/search/name/:name")
    getByName(@Param('name') name: string){
        if (name)
            return this.categoriaService.searchByName(name);
    }

    @Get("/search/id/:id")
    getById(@Param('id') id: number){
        if (id) 
            return this.categoriaService.searchById(id);
    }
}
