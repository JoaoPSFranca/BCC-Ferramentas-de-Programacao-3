import { PessoaService } from './../services/Pessoa.service';
import { PessoaListPage } from './../pessoa-list/pessoa-list.page';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonList, IonButton} from '@ionic/angular/standalone';
import { Pessoa } from '../models/pessoa';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonButton, FormsModule, IonList, IonItem, IonInput, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  protected nome!: string;
  protected telefone!: string;
  protected senha!: string;
  protected email!: string;

  private pessoas: Pessoa[] = [];
  protected mensagem!: string;

  private pessoaService = inject(PessoaService); 
  private router = inject(Router);

  constructor() { }
  
  protected salvarPessoa() {
    const pessoa: Pessoa = {
      nome: this.nome,
      telefone: this.telefone,
      senha: this.senha,
      email: this.email
    }

    this.pessoaService.adicionar(pessoa);
    this.router.navigate(['pessoa-list']);
  }
}
