import { Login } from './../../models/login';
import { LoginService } from './../service/login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonButton, IonInput, IonItem, IonList, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {

  private formBuilder = inject(FormBuilder);
  private loginService = inject(LoginService);

  protected profileForm = this.formBuilder.group(
    {
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    }
  );  

  constructor() {}

  public log() {
    return this.loginService.login()
  }
}

