import { Component, inject } from '@angular/core';
import { IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, IonSelect, IonSelectOption, IonItem, IonGrid, IonRow, IonCol, IonFooter, IonButton } from '@ionic/angular/standalone';
import { ProdutosService } from '../services/produtos.service';
import { Categoria } from '../models/categoria.model';
import { Produto } from '../models/produto.model';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonFooter,
    IonCol,
    IonRow,
    IonGrid,
    FormsModule,
    CurrencyPipe,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon
],
})
export class HomePage {
  private produtoService = inject(ProdutosService);
  //todos os produtos
  private produtos: Produto[] = [];
  //Lista
  protected produtosSelecionados: Produto[] = [];
  //Select
  protected categorias: Categoria[] = [];
  protected idCategoria!: number;
  protected produtoMaisCaro!: Produto;
  protected produtoMenorQuantidade!: Produto;

  constructor() {
    this.obterCategorias();
    this.obterProdutos();

    addIcons({ trashOutline });
  }

  protected pesquisar() {
    console.log('Pesquisar');
    console.log(this.produtos);
    
    
    this.produtosSelecionados = this.produtos.filter(
      (item) => item.categoria.id == this.idCategoria
    );

    console.log(this.produtosSelecionados);
    
    this.obterEstatisticas();
  }

  private obterEstatisticas() {
    if (this.produtosSelecionados.length > 0) {
      this.produtoMenorQuantidade = this.produtosSelecionados[0];
      this.produtoMaisCaro = this.produtosSelecionados[0];
      for (let i = 1; i < this.produtosSelecionados.length; i++) {
        if (this.produtoMaisCaro.preco < this.produtosSelecionados[i].preco) {
          this.produtoMaisCaro = this.produtosSelecionados[i];
        }

        if (
          this.produtoMenorQuantidade.quantidade_em_estoque >
          this.produtosSelecionados[i].quantidade_em_estoque
        ) {
          this.produtoMenorQuantidade = this.produtosSelecionados[i];
        }
      }
    }
  }

  private obterCategorias() {
    this.produtoService.obterCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  private async obterProdutos() {
    // this.produtoService.obterProdutos().subscribe({
    //   next: (produtos) => {
    //     this.produtos = produtos;
    //   },
    //   error: (e) => {
    //     console.log(e);
    //   },
    // });
    this.produtos = await firstValueFrom(this.produtoService.obterProdutos());
  }

  protected remover(id: number) {
    this.produtoService.remover(id).subscribe({
      next: async (resposta) => {
        await this.obterProdutos();
        this.pesquisar();
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
}