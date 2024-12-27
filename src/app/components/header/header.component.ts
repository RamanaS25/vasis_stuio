import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonChip,
  IonButtons,
  IonModal,
  IonItem,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonLabel,
  IonMenuButton,
  IonSelect,
  IonSelectOption,
  IonSegmentButton,
  IonSegment,
  IonList,
  IonInput,
  IonToast, IonCardTitle } from '@ionic/angular/standalone';
import { ProfileComponent } from "../profile/profile.component";
import { LoginComponent } from "../login/login.component";
import { LoginService } from 'src/app/services/auth/login.service';
import { HomeService } from 'src/app/services/home/home.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonTitle,
    IonToolbar,
    IonChip,
    IonButtons,
    IonMenuButton,
    IonSelect,
    IonSelectOption,
    FormsModule,
    IonModal,
    ProfileComponent,
    LoginComponent,
    IonToast
],
})
export class HeaderComponent  implements OnInit {
  @Input() header: string = 'Vasis Studio';
  @Output() changeLangEmitter = new EventEmitter<string>();
  private api = inject(HomeService);
  auth = inject(LoginService);

  user_profile: boolean = false;
  login_open: boolean = false;
  message: string = '';
  color: string = '';
  toastBool: boolean = false;
  selectLang: string = 'ENG';
  payment_notification: boolean = false;
 
  constructor() { }

  handleNotification(message: string) {
    if (message === 'Logged in successfully') {
      this.toast('Logged in successfully', 'success');
    } else if (message === 'Please Complete your Payment for this level') {
      this.payment_notification = true;
    }
  }

  toast(message: string, color: string) {
    this.message = message;
    this.color = color;
    this.toastBool = true;
  }

  open(x: any) {
    this.login_open = false;
  }

  changeLang() {
    this.changeLangEmitter.emit(this.selectLang);
  }

  ngOnInit() {}

}
