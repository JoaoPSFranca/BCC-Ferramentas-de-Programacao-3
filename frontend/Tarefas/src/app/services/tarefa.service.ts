import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Tarefa } from '../models/tarefa.model';
import { Status } from '../models/status.model';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private http:HttpClient = inject(HttpClient);
  private tasks: Tarefa[] = [];
  private api = environment.api;
  private idMax: number = 0;

  public getTasks() {
    return this.http.get<Tarefa[]>(`${this.api}/tarefas`);
  }

  public saveTask(task: Tarefa) {
    this.getTasks().subscribe({
      next: (tasks) => {
        this.idMax = Math.max(...tasks.map(tarefa => tarefa.id));
        this.tasks = tasks.filter((t) => t.descricao = task.descricao)
        if (this.tasks.length == 0){
          task.id = this.idMax++;
          return this.http.post<Tarefa>(`${this.api}/tarefas`, task);
        } else
          return 0;
      },
      error: (e) => {
        console.log("Error save:" + e);
        return -1;
      }
    });
  }

  public removeTask(taskId: number){
    return this.http.delete<Tarefa>(`${this.api}/tarefas/${taskId}`);
  }

  public alterStatus(task: Tarefa){
    return this.http.patch<Tarefa>(`${this.api}/tarefas/${task.id}`, task);
  }
}
