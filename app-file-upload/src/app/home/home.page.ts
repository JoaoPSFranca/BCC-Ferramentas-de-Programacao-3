import { Component, inject } from '@angular/core';
import {
  ActionSheetController,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonIcon,
    IonNote,
    IonItem,
    IonList,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
  ],
})
export class HomePage {
  private toastController = inject(ToastController);
  private actionSheetCtrl = inject(ActionSheetController);
  private uploadService = inject(UploadService);
  protected arquivos: File[] = [];

  constructor() {
    addIcons({ trash });
  }

  protected remover(index: number) {
    this.arquivos.splice(index, 1);
  }

  protected enviar() {
    this.uploadService.upload(this.arquivos).subscribe({
      next: () => {
        console.log('Arquivos enviados!');
        this.arquivos = [];
        this.exibirMensagem('Arquivos enviados!');
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  protected adicionarArquivos(evento: any) {
    const files = evento.target.files as FileList; //FileList
    console.log(files);
    
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        if (this.arquivos.find((arquivo) => arquivo.name === file.name)) {
          this.exibirMensagem(`${file.name} já foi adicionado.`);
        } else if (file.size < 100000) this.arquivos.push(files.item(i)!);
        else this.exibirMensagem(`${file?.name} excedeu o tamanho máximo.`);
      }
    }
  }

  private async exibirMensagem(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

  protected async confirmarExclusao(index: number) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: `Confirma exclusão do arquivo ${this.arquivos[index].name} ?`,
      buttons: [
        {
          text: 'Sim',
          role: 'destructive',
          handler: () => {
            this.arquivos.splice(index, 1);
          },
          data: {
            action: 'delete',
          },
        },
        {
          text: 'Não',
          data: {
            action: 'share',
          },
        },
      ],
    });

    await actionSheet.present();
  }
}
