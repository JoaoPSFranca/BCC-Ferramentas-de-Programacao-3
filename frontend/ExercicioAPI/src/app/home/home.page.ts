import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonCardTitle } from '@ionic/angular/standalone';
import { ProductsService } from '../services/products.service';
import { Products } from '../models/products';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CurrencyPipe, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonCardTitle],
})
export class HomePage {
  protected productsService = inject(ProductsService);
  protected products: Products[] = [];
  protected cont: number = 0;
  protected media: number = 0;

  constructor() {
    this.productsService.getAll()
    .subscribe({
      next: (resposta) => {
        resposta.products.map((product) => {
          this.products.push({
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            description: product.description,
            stock: product.stock
          })
        });
        console.log(this.products);
      },
    });
  }

  protected avg(){
    this.media = this.cont/this.products.length;
  }

  protected gambiarra(text: string, valor: number){
    this.cont += valor;
    return text;
  }
}
