import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TutorialService } from 'src/app/services/tutorial/tutorial.service';
import { addIcons } from 'ionicons';

import {
  IonMenuButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonIcon,
  IonButton,
  IonModal,
  IonCardContent,
  IonInput,
  IonSegment,
  IonSegmentButton,
  IonButtons,
  IonCardHeader,
} from '@ionic/angular/standalone';
import { YoutubePlayerComponent } from '../../components/youtube-player/youtube-player.component';
import {
  checkmarkOutline,
  storefrontOutline,
  logoInstagram,
  logoFacebook,
  logoGoogle,
  logoWhatsapp,
  logoGooglePlaystore,
  logoAppleAppstore,
  addOutline,
  createOutline,
  closeOutline,
  logoYoutube,
} from 'ionicons/icons';
import { LoginService } from 'src/app/services/auth/login.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
addIcons({
  checkmarkOutline: checkmarkOutline,
  storefrontOutline: storefrontOutline,
  logoFacebook: logoFacebook,
  logoGoogle: logoGoogle,
  logoInstagram: logoInstagram,
  logoWhatsapp: logoWhatsapp,
  logoGooglePlaystore: logoGooglePlaystore,
  logoAppleAppstore: logoAppleAppstore,
  logoYoutube: logoYoutube,
});
@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
  standalone: true,
  imports: [
    IonMenuButton,
    IonButtons,
    IonSegmentButton,
    IonSegment,
    IonInput,
    IonCardContent,
    IonModal,
    IonButton,
    IonIcon,
    IonCard,
    IonSelect,
    IonSelectOption,
    IonList,
    IonLabel,
    IonItem,
    IonAccordion,
    IonAccordionGroup,
    IonCol,
    IonRow,
    IonGrid,
    IonChip,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    YoutubePlayerComponent,
  ],
})
export class TutorialPage implements OnInit {
  videoUrl: SafeResourceUrl = ''; 
  api = inject(TutorialService);
  user = inject(LoginService)
  selectLang = 'ENG';
  tutorials: any;
  tutorials_text: any;
  group_names: any;

  video: any;
  _names: any;
  page_text: any;
  newVideo = {
    video_id: '',
    title_e: '',
    title_s: '',
    title_p: '',
    group_title_e: '',
    group_title_s: '',
    group_title_p: '',
    order_number: 0,
  };

  modal_open: boolean = false;
  open_video: boolean = false;
  _update: boolean = false;

  sanitizer = inject(DomSanitizer);
  constructor() {
    this.getTutorials();
    this.getTutorials_text();
    this.videoUrl = this.setVideoUrl('QCO9VSj4h18');
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  async addNewVideo() {
    let id: any = this.getYouTubeVideoId(this.newVideo.video_id);
    this.newVideo.video_id = id;
    let x = await this.api.newVideo(this.newVideo);
    this.open_video = false;
    this.getTutorials();
    console.log(this.newVideo);
  }

  selectFOrAdd(id: number) {
    this.newVideo = this.tutorials.find(
      (item: { id: number }) => item.id === id
    );
    this.newVideo.title_e = '';
    this.newVideo.title_s = '';
    this.newVideo.title_p = '';
    this.newVideo.video_id = '';

    console.log(this.newVideo);
  }

  selectVideo(id: number) {
    this.newVideo = this.tutorials.find(
      (item: { id: number }) => item.id === id
    );
    this.open_video = true;
    this._update = true;
    console.log(this.newVideo);
  }

  async editVideo() {
    let x = await this.api.editVideo(this.newVideo);
    this.open_video = false;
    this.getTutorials();
  }

  async deleteVideo() {
    console.log(this.newVideo);
    let x = await this.api.deleteVideo(this.newVideo);
    this.open_video = false;
    this.getTutorials();
  }

  getTutorials() {
    let x = this.api.getTutorials();
    x.then((result) => {
      if (result.success) {
        this.tutorials = result.data;
        this.group_name();
        this.names();
        this.text();

        console.log(this.tutorials);
      } else {
        console.error(result.error);
      }
    });
  }

  setVideoUrl(id: string): SafeResourceUrl {
    return  this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube-nocookie.com/embed/' + id);
  }

  getTutorials_text() {
    let x = this.api.getTutorial_text();
    x.then((result) => {
      if (result.success) {
        this.tutorials_text = result.data;
        let x = this.tutorials_text[0];
        this.video = {
          video_id: this.sanitizeUrl('https://www.youtube-nocookie.com/embed/' + x.video_id),
          title_e: x.video_title_e,
          title_s: x.video_title_s,
          title_p: x.video_title_p,
        };
        console.log(this.tutorials_text);
      } else {
        console.error(result.error);
      }
    });
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  group_name() {
    let array: any = [];
    switch (this.selectLang) {
      case 'ENG':
        array = this.tutorials.map((element: { group_title_e: any }) => {

          return element.group_title_e;
        });
        break;
      case 'SPN':
        array = this.tutorials.map((element: { group_title_s: any }) => {
          return element.group_title_s;
        });
        break;
      case 'POR':
        array = this.tutorials.map((element: { group_title_p: any }) => {
          return element.group_title_p;
        });
        break;
    }

    this.group_names = [...new Set(array)];
  }

  names() {
    let array: any = [];
    switch (this.selectLang) {
      case 'ENG':
        array = this.tutorials?.map(
          (element: {
            id: number;
            title_e: any;
            group_title_e: any;
            video_id: any;
            order_number: number;
          }) => {
            return {
              id: element.id,
              title: element.title_e,
              group_title: element.group_title_e,
              video_id: this.setVideoUrl(element.video_id),
              order_number: element.order_number,
            };
          }
        );
        break;
      case 'SPN':
        array = this.tutorials?.map(
          (element: {
            id: number;
            title_s: any;
            group_title_s: any;
            video_id: any;
            order_number: number;
          }) => {
            return {
              id: element.id,
              title: element.title_s,
              group_title: element.group_title_s,
              video_id: this.setVideoUrl(element.video_id),
              order_number: element.order_number,
            };
          }
        );
        break;
      case 'POR':
        array = this.tutorials?.map(
          (element: {
            id: number;
            title_p: any;
            group_title_p: any;
            video_id: any;
            order_number: number;
          }) => {
            return {
              id: element.id,
              title: element.title_p,
              group_title: element.group_title_p,
              video_id: this.setVideoUrl(element.video_id),
              order_number: element.order_number,
            };
          }
        );
        break;
    }
    this._names = array;
  }

  text() {
    let array: any = [];
    switch (this.selectLang) {
      case 'ENG':
        array = this.tutorials_text?.map(
          (element: {
            id: number;
            question_e: any;
            answer_e: any;
            tips_e: any;
            video_title_e: any;
            video_id: any;
          }) => {
            return {
              id: element.id,
              question: element.question_e,
              answer: element.answer_e,
              tips: element.tips_e,
              video_title: element.video_title_e,
              video_id: element.video_id,
            };
          }
        );
        break;
      case 'SPN':
        array = this.tutorials_text?.map(
          (element: {
            id: number;
            question_s: any;
            answer_s: any;
            tips_s: any;
            video_title_s: any;
            video_id: any;
          }) => {
            return {
              id: element.id,
              question: element.question_s,
              answer: element.answer_s,
              tips: element.tips_s,
              video_title: element.video_title_s,
              video_id: element.video_id,
            };
          }
        );
        break;
      case 'POR':
        array = this.tutorials_text?.map(
          (element: {
            id: number;
            question_p: any;
            answer_p: any;
            tips_p: any;
            video_title_p: any;
            video_id: any;
          }) => {
            return {
              id: element.id,
              question: element.question_p,
              answer: element.answer_p,
              tips: element.tips_p,
              video_title: element.video_title_p,
              video_id: element.video_id,
            };
          }
        );
        break;
    }
    this.page_text = array;
  }

  edit(
    page_text: {
      id: number;
      question: string;
      answer: string;
      tips: string;
      video_title: string;
      video_id: string;
    }[]
  ) {
    let id: any = this.getYouTubeVideoId(page_text[0].video_id);
    page_text[0].video_id = id;
    switch (this.selectLang) {
      case 'ENG':
        this.api.editTextEng(page_text);
        break;
      case 'SPN':
        this.api.editTextSpn(page_text);
        break;
      case 'POR':
        this.api.editTextPor(page_text);
        break;
    }
    this.modal_open = false;
  }

  get video_id() {
    return this.tutorials_text[0]?.video_id;
  }

  getYouTubeVideoId(input: string) {
    if (input.includes('youtube.com') || input.includes('youtu.be')) {
      try {
        const urlObj = new URL(input);

        if (urlObj.hostname === 'youtu.be') {
          return urlObj.pathname.substring(1);
        }

        return urlObj.searchParams.get('v');
      } catch (error) {
        console.error('Некорректная ссылка:', error);
        return null;
      }
    }

    if (input.length === 11) {
      return input;
    }

    console.error('Некорректный идентификатор или ссылка');
    return null;
  }

  ngOnInit() {}
}
