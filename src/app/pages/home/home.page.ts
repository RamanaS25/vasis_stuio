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
  IonToast,
} from '@ionic/angular/standalone';

import { register } from 'swiper/element/bundle';
import { YoutubePlayerComponent } from 'src/app/components/youtube-player/youtube-player.component';
import { addIcons } from 'ionicons';
import { LoginComponent } from 'src/app/components/login/login.component';
import {
  logoInstagram,
  logoWhatsapp,
  logoFacebook,
  close,
  pencil,
  logoGoogle,
} from 'ionicons/icons';
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
    IonToast,
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
    YoutubePlayerComponent,
    LoginComponent,
    IonModal,
    SwiperComponent,
  ],
})
export class HomePage implements OnInit {
  private api = inject(HomeService);
  auth = inject(LoginService);

  img: string = 'banner0802.jpg';

  text: any;

  _images = [
    { link: '../../../assets/img/banner0802.jpg', id: 1 },
    { link: '../../../assets/img/banner0802.jpg', id: 2 },
    { link: '../../../assets/img/banner0802.jpg', id: 3 },
  ];

  textForEdit: any;
  displayedMessages: any;
  video_id: string = 'https://www.youtube.com/watch?v=QCO9VSj4h18';
  link: string = 'https://vasisstudio.com/kirtan-school';
  selectLang = 'ENG';

  toastBool = false;
  message: string = '';
  color: string = 'danger';
  login_open: boolean = false;
  edit_open: boolean = false;
  edit_img_open: boolean = false;
  selectedFile: File | null = null;
  user_profile: boolean = false;
  payment_notification: boolean = false;

  selectedImageId!: number;
  constructor() {
    addIcons({
      logoInstagram,
      logoFacebook,
      logoGoogle,
      logoWhatsapp,
      close,
      pencil,
    });
    this.getText();
  }

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

  async getText() {
    try {
      const x = await this.api.getHome();
      this.text = x.data;
      this._images = this.text.slice(0, -1).map((element: any) => {
        return { link: element.img, id: element.id };
      });
      console.warn(this._images);
      console.warn(this.text);
      if (this.text?.[3]?.img) {
        this.img = this.text[3].img;
      }

      if (this.text?.[0]?.link) {
        this.link = this.text[0].link;
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    }
  }

  _lang() {
    this.edit_text();
  }

  edit_text() {
    if (!this.text) return;

    switch (this.selectLang) {
      case 'ENG':
        this.textForEdit = this.text.map((element: any) => ({
          id: element.id,
          message: element.message_e,
          video_title: element.video_title_e,
          video_id: element.video_id,
          link: element.link,
        }));
        break;
      case 'SPN':
        this.textForEdit = this.text.map((element: any) => ({
          id: element.id,
          message: element.message_s,
          video_title: element.video_title_s,
          video_id: element.video_id,
          link: element.link,
        }));
        break;
      case 'POR':
        this.textForEdit = this.text.map((element: any) => ({
          id: element.id,
          message: element.message_p,
          video_title: element.video_title_p,
          video_id: element.video_id,
          link: element.link,
        }));
        break;
    }
  }

  async saveEdit(
    pageText: {
      id: number;
      message: string;
      video_title: string;
      video_id: string;
      link: string;
    }[]
  ) {
    try {
      switch (this.selectLang) {
        case 'ENG':
          await this.api.editTextEng(pageText);
          this.getText();
          this.edit_open = false;
          break;
        case 'SPN':
          await this.api.editTextSp(pageText);
          this.getText();
          this.edit_open = false;
          break;
        case 'POR':
          await this.api.editTextPor(pageText);
          this.getText();
          this.edit_open = false;
          break;
      }
    } catch (error) {
      console.error('Error saving text:', error);
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async uploadImage() {
    try {
      if (!this.selectedFile) return;

      const result = await this.api.uploadImage(
        this.selectedFile,
        this.selectedImageId
      );
      if (result.success) {
        this.getText();
        console.warn('img uploaded');
        this.edit_img_open = false;
      }

      if (result.error) {
        console.log('Error uploading image:', result.error);
        this.toast('Error Uploading Image', 'danger');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  ngOnInit() {
    console.log('HomePage initialized');
  }
}
