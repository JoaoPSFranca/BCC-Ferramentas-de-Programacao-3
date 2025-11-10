/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './pessoa.entity';
import { Like, Repository } from 'typeorm';

// nest g s pessoa
@Injectable()
export class PessoaService {
    
    constructor(
        @InjectRepository(Pessoa) 
        private pessoaRepository: Repository<Pessoa>
    ) {}

    public insert(pessoa: Partial<Pessoa>) {
        return this.pessoaRepository.save(pessoa);
    }

    public searchAll() {
        return this.pessoaRepository.find();
    }

    public search(name: string) {
        return this. pessoaRepository.find({
            where: {
                nome: Like(`%${name}%`)
            }
        })
    }
}
