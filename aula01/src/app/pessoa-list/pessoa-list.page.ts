import { PessoaService } from './../services/Pessoa.service';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonFabButton, IonFab, IonIcon, IonSearchbar } from '@ionic/angular/standalone';
import { Pessoa } from '../models/pessoa';

import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pessoa-list',
  templateUrl: './pessoa-list.page.html',
  styleUrls: ['./pessoa-list.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonIcon, IonFab, IonFabButton, IonCol, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PessoaListPage implements OnInit {

  private pessoaService = inject(PessoaService);
  protected pessoas: Pessoa[];
  protected isFilter: boolean = false;

  private router = inject(Router);

  constructor() {
    addIcons({ add });
    this.pessoas = this.pessoaService.getAll();
    console.log("Pesquisou todos.");
  }

  ngOnInit() {
  }

  protected goToHome(){
    this.router.navigate(['/home']);
  }

  textChange(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.pessoas = this.pessoaService.search(query);
    this.isFilter = true;
  }
}
