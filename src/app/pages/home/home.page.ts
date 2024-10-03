import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
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
  logoGoogle,
} from 'ionicons/icons';

// register Swiper custom elements
register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
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
  user = {
    username: 'Ramana',
    intiated_name: 'Ramana',
    password: 'Point123',
    _password: 'Point123',
    email: 'ramana@gmail.com',
    phone: '+91 9876543210',
    lang_type: 'English',
  };
  login_open: boolean = false;
  signup_open: boolean = false;
  profile_open: boolean = false;

  constructor() {
    addIcons({ logoInstagram, logoFacebook, logoGoogle, logoWhatsapp });
  }

  open(x: any) {
    this.login_open = false;
  }

  ngOnInit() {}
}
