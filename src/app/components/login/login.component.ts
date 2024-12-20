import { Component, EventEmitter, inject, Input, OnInit, Output, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonToolbar,
  IonButtons,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonChip,
  IonProgressBar,
  IonToast,
} from '@ionic/angular/standalone';
import { LoginService } from 'src/app/services/auth/login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonToolbar,
    IonButtons,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonChip,
    IonProgressBar,
    IonToast,
    CommonModule,
    FormsModule,
  ],
})
export class LoginComponent implements OnInit {
  api = inject(LoginService)
  open_toast: boolean = false;
  message: string = '';

  isloading = false;
  @Input() login_open = false;
  @Output() _message = new EventEmitter<string>();
  signup_open = false;
  user = {
    user_name: '',
    legal_name: '',
    initiated_name: '',
    password: '',
    email: '',
    phone: '',
    language: 'English',
    group_name: '0',
    grade: 1,
    is_registered: false,
  };
  _password = '';
  loginOutput = output<boolean>();
  constructor() {}

  closeModal(x: boolean) {
    this.loginOutput.emit(x);
  }
  login() {
    this.isloading = true;

    this.api.login(this.user).then((res) => {
      this.isloading = false;
      if (res.success) {
        console.log('like',res.message)
     
          console.log('like', res.message);
          this._message.emit(res.message);
        
        this.closeModal(true);
      } else {
        this.open_toast = true;
        this.message = res.error || 'An unexpected error occurred';
      }
    });
  }


  signUp() {
    if (this.user.password !== this._password) {
      this.open_toast = true;
      this.message = 'Passwords do not match';
      return;
    }
    const atSymbolIndex = this.user.email.indexOf('@');
    const dotIndex = this.user.email.lastIndexOf('.');
    let check =
      atSymbolIndex > 0 &&
      dotIndex > atSymbolIndex + 1 &&
      dotIndex < this.user.email.length - 1;
    if (!check) {
      this.open_toast = true;
      this.message = 'Invalid Email';
      return;
    }
    const userValue = Object.values(this.user);
    userValue.forEach((value, index) => {
      if (value === '') {
        this.open_toast = true;
        this.message = 'Please fill all the fields';
        return;
      }
    });

    this.api.register(this.user).then((res) => {
      if(res.success){
        this.open_toast = true;
        this.message = 'Account created successfully';
        this.signup_open = false;
      }else{
        this.open_toast = true;
        this.message = res.error || 'An unexpected error occurred';
      }
    })
  }

  ngOnInit() {
  console.log('login')
  }



  
}
