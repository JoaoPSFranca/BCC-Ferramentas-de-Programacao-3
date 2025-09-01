import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Categoria } from '../models/categoria.model';
import { Produto } from '../models/produto.model';
import { PropOptions } from 'ionicons/dist/types/stencil-public-runtime';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  private http = inject(HttpClient);
  private api = environment.api;
  private produtos: Produto[] = [];

  public obterCategorias() {
    return this.http.get<Categoria[]>(`${this.api}/categorias`);
  }
  
  public obterProdutos() {
    return this.http.get<Produto[]>(`${this.api}/produtos`);
  }
  
  public obterProdutosPeloId(id: number) {
    return this.http.get<Produto>(`${this.api}/produtos/${id}`);
  }

  public remover(id: number) {
    return this.http.delete<Produto>(`${this.api}/produtos/${id}`);
  }

  public salvar(prod: Produto) {
    this.obterProdutos().subscribe({
      next: (prods) => {
        this.produtos = prods;
        const id = this.produtos.reduce((max, produto) => {
          return produto.id > max ? produto.id : max;
        }, -Infinity);
        prod.id = id;

        return this.http.post<Produto>(`${this.api}/produtos`, prod);
      },
      error: (e) => {
        return e;
        console.log(e);
      }
    });
  }
}