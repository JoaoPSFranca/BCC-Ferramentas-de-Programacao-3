import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Produto } from '../models/produto.model';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class PesquisaService {
  private http = inject(HttpClient);
  private api = environment.api;

  public getAllProdutos(){
    return this.http.get<Produto>(`${this.api}/produtos`)
  }

  public getAllCategorias(){
    return this.http.get<Categoria>(`${this.api}/categorias`)
  }
}
