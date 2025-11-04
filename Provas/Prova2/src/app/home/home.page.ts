import { FotoService } from './../services/Foto.service';
import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonIcon, IonButton, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCard, IonList, IonItem, ToastController } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { Foto } from '../models/Foto.model';
import { Router } from "@angular/router";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonItem, IonList, IonCard, IonCardSubtitle, IonCardTitle, IonCardHeader, IonButton, IonIcon, IonSearchbar, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  private fotoService:FotoService = inject(FotoService);
  protected fotos: Foto[] = [];
  protected data: Foto[] = [];
  private router: Router = inject(Router)
  private apiPath = environment.api;

  constructor(private toastController: ToastController) {
    addIcons({ add });
  }

  ionViewDidEnter() {
    this.atualizarLista();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
      color: color,
    });

    await toast.present();
  }

  private atualizarLista(){
    this.fotoService.getAll().subscribe({
      next: (fotos) => {
        for (let f of fotos.photos) {
          const foto: Foto = {
            tags: f.tags,
            file: {
              destination: f.file.destination,
              fieldname: f.file.fieldname,
              mimetype: f.file.mimetype,
              encoding: f.file.encoding,
              filename: f.file.filename,
              originalname: f.file.originalname,
              path: f.file.path,
              size: f.file.size
            }
          }

          this.fotos.push(foto);
          this.data.push(foto);
        }
      },
      error: (e) => this.presentToast("error: " + e, "danger") 
    })
  }

  protected navi() {
    this.router.navigate(['cadastro'])
  }

  protected pegarImagem(caminho: string){
    return `${this.apiPath}/${caminho}`
  }

  protected pesquisar(evento: Event) {
    const target = evento.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.fotos = this.data.filter((d) => {
      if (d.tags !== undefined) 
        d.tags.toLowerCase().includes(query) 
    });
  }
}
