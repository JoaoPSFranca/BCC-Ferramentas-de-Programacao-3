import { PesquisaService } from './../services/pesquisa.service';
import { LOCALE_ID, Component, inject, OnInit } from '@angular/core';
import { IonSelect, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonList, IonItem, IonSelectOption, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { Produto } from '../models/produto.model';
import { Categoria } from '../models/categoria.model';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CurrencyPipe, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonList, IonItem, IonSelect, IonSelectOption, IonGrid, IonRow, IonCol],
})
export class HomePage {
  protected produtos: Produto[] = [];
  protected categorias: Categoria[] = [];
  protected pesquisaService = inject(PesquisaService);
  protected maisCaro = {
    valor: 0,
    nome: ""
  };
  protected menorQtd = {
    valor: -1,
    nome: ""
  };

  

  constructor() {}

  ionViewWillEnter() {
    this.getCategorias();
  }

  public getCategorias(){
    this.pesquisaService.getAllCategorias().subscribe({
      next: (cats: any) => {
        this.categorias = cats;
      }, 
      error: (erro) => {
          console.log(erro)
      },
    });
  }

  public catChange(event: CustomEvent) {
    switch (event.detail.value) {
      case 1:
        this.atualizarListaProdutos("Eletrônicos");
        break;
      case 2:
        this.atualizarListaProdutos("Livros");
        break;
      case 3:
        this.atualizarListaProdutos("Móveis");
        break;
      case 4:
        this.atualizarListaProdutos("Vestuário");
        break;
      case 5:
        this.atualizarListaProdutos("Eletrodomésticos");
        break;
      default:
        console.log("Erro de Seleção");
        break;
    }
  }

  public atualizarListaProdutos(cat: string){
    this.maisCaro = {
      valor: 0,
      nome: ""
    };
    this.menorQtd = {
      valor: -1,
      nome: ""
    };

    this.pesquisaService.getAllProdutos().subscribe({
      next: (prods: any) => {
        this.produtos = prods;
        this.produtos = this.produtos.filter(
          (prod) => prod.categoria.nome == cat
        );
        this.produtos.forEach(prod => {
          if (prod.preco > this.maisCaro.valor) {
            this.maisCaro.nome = prod.nome;
            this.maisCaro.valor = prod.preco;
          } 
          if (prod.quantidade_em_estoque < this.menorQtd.valor || this.menorQtd.valor == -1) {
            this.menorQtd.nome = prod.nome;
            this.menorQtd.valor = prod.quantidade_em_estoque;
          }
        });
      }, 
      error: (erro) => {
          console.log(erro)
      },
    });

    
  }
}