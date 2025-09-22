import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FotoResponse } from '../models/FotoResponse.model';
import { FileSender } from '../models/FileSender.model';

@Injectable({
  providedIn: 'root'
})
export class FotoService {
  private http:HttpClient = inject(HttpClient)
  private api = environment.api;

  public getAll() {
    return this.http.get<FotoResponse>(`${this.api}/photos`);
  }

  public savePhoto(photo: FileSender) : any {
    return this.http.post<FileSender>(`${this.api}/photos`, photo);
  }
}

