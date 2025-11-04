import { Component, inject } from '@angular/core';
import { IonCheckbox, IonHeader, IonToolbar, IonTitle, IonContent, ToastController, IonButton, IonAlert, IonList, IonItem } from '@ionic/angular/standalone';
import type { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonAlert, IonList, IonItem, IonCheckbox],
})
export class HomePage {
  private toastController = inject(ToastController);

  setResult(event: CustomEvent<OverlayEventDetail>) {
    console.log(`Dismissed with role: ${event.detail.role}`);
  }

  constructor() {}

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        this.exibirMensagem('Alert Canceled')
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.exibirMensagem('Alert confirmed');
      },
    },
  ];

  private async exibirMensagem(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

  protected enviar() {
    this.exibirMensagem('Eu fui apertado');
  }
}
