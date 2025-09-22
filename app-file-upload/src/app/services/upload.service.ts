import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private http = inject(HttpClient);
  
  //http://10.117.64.163:3000
  private api = environment.api;

  public upload(arquivos: File[]) {

    const formData = new FormData();
    arquivos.forEach((arquivo) => {
      formData.append("files", arquivo);
    });

    return this.http.post<void>(`${this.api}/uploads`, formData);
  }
  
}
