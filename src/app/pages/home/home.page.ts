import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
} from '@ionic/angular/standalone';


import { register } from 'swiper/element/bundle';
import { YoutubePlayerComponent } from 'src/app/components/youtube-player/youtube-player.component';
import { addIcons } from 'ionicons';

import { LoginComponent } from 'src/app/components/login/login.component';
import {
  logoInstagram,
  logoWhatsapp,
  logoFacebook,
  logoGoogle, close, 
  pencil} from 'ionicons/icons';
import { LoginService } from 'src/app/services/auth/login.service';
import { ProfileComponent } from 'src/app/components/profile/profile.component';


// register Swiper custom elements
register();

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    ProfileComponent,
    IonButtons,
    IonChip,
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    YoutubePlayerComponent,
    LoginComponent,
    IonModal,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})



export class HomePage implements OnInit {

  auth = inject(LoginService)
  messages: any[] = [
    {
      title: 'New batches start every month for Module 1 and Module 2.',
      message:
        'The most effective kirtan school will start new batches very soon. Tell your friend who would love to learn how to lead kirtan with Harmonium.',
      link: 'https://vasisstudio.com/kirtan-school',
      icon: '',
    },

    {
      title: 'LOOK DOWN FOR THE BEST HOMEWORK OF THE WEEK!!!',
      message:
        'This week the best Homework for the week for the first Module is from our Student Kamalaksha, playing Jaya Radha Madhava',
      link: 'https://vasisstudio.com/kirtan-school',
      icon: '',
    },
    {
      title: null,
      message: 'Have your rated us on Google? Give your Feedback !',
      link: 'https://vasisstudio.com/kirtan-school',
      icon: '',
    },
  ];
    toastBool = false;
    message: string = '';
    color: string = 'danger';

  login_open: boolean = false;
  user_profile: boolean = false;
  payment_notification: boolean = false;



  constructor() {
    addIcons({close,logoInstagram,logoFacebook,logoGoogle,logoWhatsapp,pencil});


  }



  handleNotification(message: string) {
    if (message === 'Logged in successfully') {
      
      this.toast('Logged in successfully', 'success');
    } else if (message === 'Please Complete your Payment for this level') {
      this.payment_notification = true;
    }
  }

  toast(message: string, color: string) {
    console.log(message)
    this.message = message;
    this.color = color;
    this.toastBool = true;
  }

  open(x: any) {
    this.login_open = false;
  }

  ngOnInit() {
    console.log("home")
  }
}
