import { Component, inject, numberAttribute, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonSelect, IonInput, IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonSelectOption, IonButton } from '@ionic/angular/standalone';
import { Categoria } from '../models/categoria.model';
import { Produto } from '../models/produto.model';
import { ProdutosService } from '../services/produtos.service';

@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.page.html',
  styleUrls: ['./cadastro-produto.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonInput, IonSelect, IonSelectOption, ReactiveFormsModule, IonButton]
})
export class CadastroProdutoPage implements OnInit {
  private formBuilder = inject(FormBuilder);
  private produtoService = inject(ProdutosService);

  protected forms = this.formBuilder.group({
    categoria: [{
      id: '',
      nome: ''
    }, [Validators.required]],
    nome: ['', [Validators.required]],
    preco: ['', [Validators.required, Validators.min(0.01)]],
    quantidade: ['', [Validators.required, Validators.min(1)]]
  });

  protected categorias: Categoria[] = [];
  protected idCategoria!: number;

  constructor() {
    this.obterCategorias();
  }

  ngOnInit() {
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

  protected enviar() {
    if (!this.forms.invalid){
      
      const prod: Produto = {
        categoria: {
          id: Number.parseInt(this.forms.value.categoria?.id!),
          nome: this.forms.value.categoria?.nome!
        },
        nome: this.forms.value.nome!,
        preco: Number.parseInt(this.forms.value.preco!),
        quantidade_em_estoque: Number.parseInt(this.forms.value.quantidade!),
        id: 0
      }

      this.produtoService.salvar(prod).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (e) => {
          console.log(e);
        }
      });
    }
  }
}
