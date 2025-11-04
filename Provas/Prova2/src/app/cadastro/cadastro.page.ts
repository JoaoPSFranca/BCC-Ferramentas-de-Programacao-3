import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons, IonItem, IonInput, IonList, IonButton, ToastController } from '@ionic/angular/standalone';
import { FotoService } from '../services/Foto.service';
import { FileSender } from '../models/FileSender.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [IonButton, IonList, IonInput, IonItem,
    IonButtons,
    IonBackButton,
    IonContent,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule, IonHeader],
})
export class CadastroPage   {
  private foto: File = new File([], "");
  private maxSize = 200000;
  private fotoService: FotoService = inject(FotoService);
  protected tag: string = "";
  private router: Router = inject(Router)

  constructor(private toastController: ToastController) {}

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
      color: color,
    });

    await toast.present();
  }

  protected getFoto(evento: any) {
    const files = evento.target.files as FileList;
    const file = files.item(0);
    
    if (file)
      this.foto = file;
  }

  protected send() {
    if (this.foto !== new File([], "")){
      if (this.foto.size < this.maxSize) {
        if (this.tag != ""){
          const foto:FileSender = {
            file: this.foto,
            tags: this.tag
          }

          this.fotoService.savePhoto(foto).subscribe({
            next: (res: any) => {
              this.presentToast("Foto cadastrada com sucesso", "success");
              this.router.navigate(['home']);
            },
            error: (e: any) => this.presentToast("error: " + e, "danger")
          });

        } else
          this.presentToast("Informar a tag da imagem. ", "warning");
      } else 
        this.presentToast("Validadtion failed (current file size is " + this.foto.size + ", expected size is less than " + this.maxSize + ". ", "danger");
    } else 
      this.presentToast("Informar a imagem. ", "warning");
  }
}
