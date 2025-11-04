import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Login } from 'src/models/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private http = inject(HttpClient);
  private api = environment.api;

  public login(email: string, password:string) {
    const login = {
      email: email,
      password: password,
    };

    return this.http.post(`${this.api}/login`, login, {headers: this.getHeaders()});
  }

  private getHeaders() {
    return new HttpHeaders({
      'x-api-key': 'reqres-free-v1',
    });
  }
}
