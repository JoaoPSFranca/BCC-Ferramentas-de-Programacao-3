import { TarefaService } from './../services/tarefa.service';
import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButton,
  IonRow,
  IonCol,
  IonGrid,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  trash,
  close,
  checkmarkCircleOutline,
  create,
} from 'ionicons/icons';
import { Tarefa } from '../models/tarefa.model';
import { Status } from '../models/status.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonGrid,
    IonCol,
    IonRow,
    IonButton,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
  ],
})
export class HomePage {
  protected tarefas: Tarefa[] = [];
  protected tarefaService: TarefaService = inject(TarefaService);
  protected stat = Status;

  constructor(private toastController: ToastController) {
    this.searchTasks();
    addIcons({ add, trash, close, checkmarkCircleOutline, create });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color
    });

    await toast.present();
  }

  protected searchTasks() {
    this.tarefaService.getTasks().subscribe({
      next: (tasks) => {
        this.tarefas = tasks;
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  protected alterStatus(task: Tarefa, stat: Status) {
    if (task.status === Status.Cadastrada) {
      if (stat === Status.Concluida){
        task.status = Status.Andamento;
        this.tarefaService.alterStatus(task).subscribe({
          next: () => {
            this.searchTasks()
            this.presentToast("Status alterado com sucesso. ", "success");
          },
          error: (e) =>  this.presentToast('Alter stats error: ' + e, 'warning'),
        });
      }
      else {
        task.status = stat;
        this.tarefaService.alterStatus(task).subscribe({
          next: () => {
            this.searchTasks()
            this.presentToast("Status alterado com sucesso. ", "success");
          },
          error: (e) =>  this.presentToast('Alter stats error: ' + e, 'warning'),
        });
      }
    } else if (task.status === Status.Andamento) {
      task.status = stat;
      this.tarefaService.alterStatus(task).subscribe({
          next: () => {
            this.searchTasks()
            this.presentToast("Status alterado com sucesso. ", "success");
          },
          error: (e) =>  this.presentToast('Alter stats error: ' + e, 'warning'),
        });
    } else 
      this.presentToast("Permissão negada. ", 'danger');
  }

  protected removeTask(task: Tarefa) {
    if (task.status === Status.Cancelada){
      this.tarefaService.removeTask(task.id).subscribe({
        next: () => {
            this.searchTasks()
            this.presentToast("Tarefa removida com sucesso. ", "success");
          },
          error: (e) =>  this.presentToast('Remove error: ' + e, 'warning'),
      });
    } else {
      this.presentToast("Tarefa precisa estar cancelada. ", 'danger');
    }
  }
}
