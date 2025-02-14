import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonChip,
  IonButtons,
  IonModal,
  IonMenuButton,
  IonSelect,
  IonSelectOption,
  IonToast,
   IonIcon } from '@ionic/angular/standalone';
import { ProfileComponent } from "../profile/profile.component";
import { LoginComponent } from "../login/login.component";
import { LoginService } from 'src/app/services/auth/login.service';
import { HomeService } from 'src/app/services/home/home.service';

import {
  TranslateService,
  TranslatePipe,
} from "@ngx-translate/core";

import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
addIcons({ chevronBackOutline });

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonIcon,
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
    IonToast,
    TranslatePipe
],
})
export class HeaderComponent  implements OnInit {
  @Input() header: string = 'Vasis Studio';
  @Input() isHeader: boolean = false;
  @Input() isBackButton: boolean = false;
  router = inject(Router);
  location = inject(Location);  

  @Output() changeLangEmitter = new EventEmitter<string>();
  @Output() changeVoiceScaleEmitter = new EventEmitter<string>();
  private api = inject(HomeService);
  auth = inject(LoginService);
  
  user_profile: boolean = false;
  login_open: boolean = false;
  message: string = '';
  color: string = '';
  toastBool: boolean = false;

  selectLang: string = 'English';
  
  payment_notification: boolean = false;
  translate = inject(TranslateService);
  constructor() { 
    this.translate.setDefaultLang('English');
    
    this.translate.use(this.auth.user_language);
    this.selectLang = this.auth.user_language;
  }

  handleNotification(message: string) {
    if (message === 'Logged in successfully') {
      this.toast('Logged in successfully', 'success');
    } else if (message === 'Please Complete your Payment for this level') {
      this.payment_notification = true;
    }
  }

  changeLang_auth(lang: string) {
    this.auth.user_language = lang;
    this.selectLang = lang;
    this.translate.use(this.auth.user_language);
  }

  isMobile() {
    return window.innerWidth <= 768; 
  }

  toast(message: string, color: string) {
    this.message = message;
    this.color = color;
    this.toastBool = true;
  }

  open(x: any) {
    this.login_open = false;
  }

  changeLang(lang: string) {
    this.changeLangEmitter.emit(lang);
  }
  

  goBack() {
    // Get the previous URL from router state
    const currentNavigation = this.router.getCurrentNavigation();
    const previousUrl = currentNavigation?.previousNavigation?.finalUrl?.toString();

    if (previousUrl) {
      // If we have a previous URL in router state, navigate to it
      this.router.navigateByUrl(previousUrl);
    } else {
      // Fallback to location service
      this.location.back();
    }
  }

  changeVoiceScale(scale: string) {
    this.auth._user.voice_scale = scale;
    this.changeVoiceScaleEmitter.emit(scale);
  }

  ngOnInit() {}

}
