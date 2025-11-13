/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from './produto.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ProdutoService {
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>
    ){}

    public insert(prod: Partial<Produto>) {
        return this.produtoRepository.save(prod);
    }

    public searchAll() {
        return this.produtoRepository.find({
            relations: { categoria: true }
        });
    }

    public searchByName(name: string) {
        return this.produtoRepository.find({
            relations: { categoria: true },
            where: { nome: Like(`%${name}%`) }
        });
    }

    public searchById(id: string) {
        return this.produtoRepository.findOne({
            relations: { categoria: true },
            where: { id }
        })
    }

    public searchByCat(cat: number) {
        return this.produtoRepository.find({
            select: { nome: true, categoria: { nome: true } },
            relations: { categoria: true },
            where: { categoria: {
                id: cat
            } }
        });
    }
}
