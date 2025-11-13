/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './categoria.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class CategoriaService {
    constructor(
        @InjectRepository(Categoria) 
        private categoriaRepository: Repository<Categoria>
    ) {}

    insert(cat: Partial<Categoria>){
        return this.categoriaRepository.save(cat);
    }

    public searchAll() {
        return this.categoriaRepository.find();
    }

    public searchByName(name: string) {
        return this.categoriaRepository.find({
            where: { 
                nome: Like(`%${name}%`)
            }
        });
    }

    public searchById(id: number) {
        return this.categoriaRepository.findOne({
            where: { id }
        })
    }
}
