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
        return this.produtoRepository.find();
    }

    public searchByName(name: string) {
        return this.produtoRepository.find({
            where: { 
                nome: Like(`%${name}%`)
            }
        });
    }

    public searchById(id: string) {
        return this.produtoRepository.findOne({
            where: {
                id: id
            }
        })
    }
}
