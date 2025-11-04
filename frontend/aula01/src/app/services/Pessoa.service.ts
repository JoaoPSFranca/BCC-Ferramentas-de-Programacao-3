import { Pessoa } from '../models/pessoa';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  
  private pessoas: Pessoa[] = []
  
  constructor() { }

  adicionar(Pessoa: Pessoa): void {
    this.pessoas.push(Pessoa);
  }

  getAll() {
    return this.pessoas;
  }

  search(query: string) {
    return this.pessoas.filter((d) => d.nome.toLowerCase().includes(query));
  }
}
