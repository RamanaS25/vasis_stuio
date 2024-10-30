import { Component, inject, OnInit } from '@angular/core';

import { HomeService } from 'src/app/services/home/home.service';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { SwiperComponent } from 'src/app/components/swiper/swiper.component';
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
import Swiper from 'swiper';

// register Swiper custom elements
register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonList,
    IonSegmentButton,
    IonSegment,
    IonMenuButton,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCard,
    IonIcon,
    IonItem,
    CommonModule,
    FormsModule,
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
    YoutubePlayerComponent,
    LoginComponent,
    IonModal,
    SwiperComponent,
  ],
})
export class HomePage implements OnInit {
  api = inject(HomeService);
  img: string = 'banner0802.jpg';
  text: any;
  textForEdit: any;
  displayedMessages: any;
  video_id: string = 'https://www.youtube.com/watch?v=QCO9VSj4h18';
  link: string = 'https://vasisstudio.com/kirtan-school';
  selectLang = 'ENG';
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

  login_open: boolean = false;
  edit_open: boolean = false;
  edit_img_open: boolean = false;
  selectedFile: File | null = null;
  constructor() {
    addIcons({ logoInstagram, logoFacebook, logoGoogle, logoWhatsapp });
    this.getText();
  }

  open(x: any) {
    this.login_open = false;
  }

  async getText() {
    let x = await this.api.getHome();
    this.text = x.data;
    this.video_id = 'https://www.youtube.com/watch?v=' + this.text[0].video_id;
    this.img = this.text[3].img;
    this.link = this.text[0].link;
  }
  _lang() {
    console.log(this.selectLang);
  }

  edit_text() {
    let array: any = [];
    switch (this.selectLang) {
      case 'ENG':
        array = this.text?.map(
          (element: {
            id: number;
            message_e: any;
            video_title_e: any;
            video_id: any;
            link: any;
          }) => {
            return {
              id: element.id,
              message: element.message_e,
              video_title: element.video_title_e,
              video_id: element.video_id,
              link: element.link,
            };
          }
        );
        break;
      case 'SPN':
        array = this.text?.map(
          (element: {
            id: number;
            message_s: any;
            video_title_s: any;
            video_id: any;
            link: any;
          }) => {
            return {
              id: element.id,
              message: element.message_s,
              video_title: element.video_title_s,
              video_id: element.video_id,
              link: element.link,
            };
          }
        );
        break;
      case 'POR':
        array = this.text?.map(
          (element: {
            id: number;
            message_p: any;
            video_title_p: any;
            video_id: any;
            link: any;
          }) => {
            return {
              id: element.id,
              message: element.message_p,
              video_title: element.video_title_p,
              video_id: element.video_id,
              link: element.link,
            };
          }
        );
    }
    this.textForEdit = array;
    console.log(this.textForEdit);
  }

  saveEdit(
    page_text: {
      id: number;
      message: string;
      video_title: string;
      video_id: string;
      link: string;
    }[]
  ) {
    console.log(page_text);
    switch (this.selectLang) {
      case 'ENG':
        this.api.editTextEng(page_text);
        break;
      case 'SPN':
        this.api.editTextSp(page_text);
        break;
      case 'POR':
        this.api.editTextPor(page_text);
        break;
    }
  }

  // async getImage() {
  //   let x = await this.api.getImage(this.img);

  //   if (x !== null) {
  //     this.img = x;
  //   }
  //   console.log('image', this.img);
  // }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('Файл выбран:', file);
    }
  }

  async uploadImage() {
    let x = await this.api.uploadImage(this.selectedFile, 4);
    if (x !== null) {
      this.img = x;
    }
  }

  ngOnInit() {}
}
