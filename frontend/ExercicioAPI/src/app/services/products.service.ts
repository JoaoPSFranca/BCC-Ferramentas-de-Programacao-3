import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Products } from '../models/products';
import { ProductsResponse } from '../models/productsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);
  private api = environment.api;

  constructor() {
    console.log(this.getAll());
  }

  public getAll() {
    return this.http.get<ProductsResponse>(`${this.api}/products`);
  }
}
