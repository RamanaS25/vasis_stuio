import { Component, inject, OnInit, SecurityContext } from '@angular/core';
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
  IonButtons,
  IonModal,
  IonItem,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonLabel,
  IonSegmentButton,
  IonSegment,
  IonInput,
  IonToast,
  IonText, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { addIcons } from 'ionicons';

import {
  logoInstagram,
  logoWhatsapp,
  logoFacebook,
  close,
  pencil,
  logoGoogle,
  closeOutline,
  createOutline,
  personCircleOutline, add } from 'ionicons/icons';
import { LoginService } from 'src/app/services/auth/login.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HeaderComponent } from "../../components/header/header.component";

import {
  TranslateService,
  TranslatePipe,
  TranslateDirective
} from "@ngx-translate/core";


// register Swiper custom elements
register();

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab, 
    IonToast,
    IonInput,
    IonSegmentButton,
    IonSegment,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCard,
    IonIcon,
    IonItem,
    CommonModule,
    FormsModule,
    IonButtons,
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonModal,
    SwiperComponent,
    HeaderComponent,
    TranslatePipe
  ],
})
export class HomePage implements OnInit {
  private api = inject(HomeService);
  auth = inject(LoginService);
  private sanitizer = inject(DomSanitizer);

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

  stored_ids = {}

  video_url1: SafeResourceUrl = '';
  video_url2: SafeResourceUrl = '';
  video_url3: SafeResourceUrl = '';
  video_url4: SafeResourceUrl = '';

  selectLang: string = 'English';

  translate = inject(TranslateService);
  constructor() {
    addIcons({close,closeOutline,add,logoInstagram,logoFacebook,logoGoogle,logoWhatsapp,createOutline,personCircleOutline,pencil,});
    this.getText();

    this.translate.setDefaultLang('English');
    
    this.translate.use(this.auth.user_language);
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
      this.sanitize_all_videos();
    } catch (error) {
      console.error('Error fetching home data:', error);
    }
  }


  edit_text() {
    if (!this.text) return;

    switch (this.selectLang) {
      case 'English':
        this.textForEdit = this.text.map((element: any) => ({
          id: element.id,
          message: element.message_e,
          video_title: element.video_title_e,
          video_id: this.extractUrl(element.video_id),
          link: element.link,
        }));
        break;
      case 'Spanish':
        this.textForEdit = this.text.map((element: any) => ({
          id: element.id,
          message: element.message_s,
          video_title: element.video_title_s,
          video_id: this.extractUrl(element.video_id),
          link: element.link,
        }));
        break;
      case 'Portuguese':
        this.textForEdit = this.text.map((element: any) => ({
          id: element.id,
          message: element.message_p,
          video_title: element.video_title_p,
          video_id: this.extractUrl(element.video_id),
          link: element.link,
        }));
        break;
    }

  }
  
  sanitize_all_videos() {
    this.text[0].video_id = this.sanitizeUrl('https://www.youtube-nocookie.com/embed/' + this.text[0].video_id);
    this.text[1].video_id = this.sanitizeUrl('https://www.youtube-nocookie.com/embed/' + this.text[1].video_id);
    this.text[2].video_id = this.sanitizeUrl('https://www.youtube-nocookie.com/embed/' + this.text[2].video_id);
    this.text[3].video_id = this.sanitizeUrl('https://www.youtube-nocookie.com/embed/' + this.text[3].video_id);
    console.log('sanitized videos', this.video_url1, this.video_url2, this.video_url3, this.video_url4);
  }

  extractUrl(safeUrl: SafeResourceUrl): string {
    // Get the sanitized URL string from the SafeResourceUrl object
    const urlString = this.sanitizer.sanitize(SecurityContext.URL, safeUrl) || '';
    
    // Remove the YouTube embed prefix to get back the video ID
    return urlString.replace('https://www.youtube-nocookie.com/embed/', '');
  }

  change_lang(lang: any) {
     this.auth.user_language = lang;
    this.edit_text();
    this.translate.use(lang);
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

  sanitizeUrl(url: string): SafeResourceUrl {
    
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {

    console.log('HomePage initialized');
  }
}
