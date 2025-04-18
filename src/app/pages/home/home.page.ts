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
  IonText,
  IonFab,
  IonFabButton,
  IonItemGroup,
  IonItemDivider,
  IonCardTitle,
  IonAccordionGroup,
  IonAccordion,
  IonNote,
} from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { addIcons } from 'ionicons';
import { SlicePipe } from '@angular/common';

import {
  logoInstagram,
  logoWhatsapp,
  logoFacebook,
  close,
  pencil,
  logoGoogle,
  closeOutline,
  createOutline,
  personCircleOutline,
  add,
  checkmarkCircle,
  videocamOutline,
  chatboxOutline,
  saveOutline,
} from 'ionicons/icons';
import { LoginService } from 'src/app/services/auth/login.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HeaderComponent } from '../../components/header/header.component';

import {
  TranslateService,
  TranslatePipe,
  TranslateDirective,
} from '@ngx-translate/core';

// register Swiper custom elements
register();

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonFabButton,
    IonFab,
    IonToast,
    IonInput,
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
    TranslatePipe,
    IonCardTitle,
    IonAccordionGroup,
    IonAccordion,
    IonNote,
    SlicePipe,
  ],
})
export class HomePage implements OnInit {
  private api = inject(HomeService);
  auth = inject(LoginService);
  private sanitizer = inject(DomSanitizer);

  home_content: any;
  banner_images: any[] = [];
  banner_img: string = '';
  messages: any[] = [];
  videos: any[] = [];
  firstTwoVideos: any[] = [];
  lastTwoVideos: any[] = [];
  bottomVideo: any;

  toastBool = false;
  message: string = '';
  color: string = 'danger';
  edit_img_open: boolean = false;
  selectedFile: File | null = null;
  selectedImageId!: number;
  payment_notification: boolean = false;

  selectLang: string = 'English';
  translate = inject(TranslateService);

  edit_content_open: boolean = false;
  editableContent: any = {
    data: [
      {
        type: 'videos',
        data: [],
      },
      {
        type: 'messages',
        data: [],
      },
    ],
  };

  stored_images: any[] = [];
  selected_stored_image: string | null = null;

  constructor() {
    addIcons({
      createOutline,
      logoInstagram,
      logoFacebook,
      logoGoogle,
      logoWhatsapp,
      close,
      closeOutline,
      checkmarkCircle,
      videocamOutline,
      chatboxOutline,
      saveOutline,
      add,
      personCircleOutline,
      pencil,
    });

    this.getHomeContent();

    this.translate.setDefaultLang('English');
    this.translate.use(this.auth.user_language);
  }

  async getHomeContent() {
    try {
      const response = await this.api.getHomeContent();
      this.home_content = response.data;

      // Process videos
      const videoSection = this.home_content.data.find(
        (section: any) => section.type === 'videos'
      );
      this.videos =
        videoSection?.data.map((video: any) => ({
          ...video,
          safeUrl: this.sanitizeUrl(
            'https://www.youtube-nocookie.com/embed/' + video.link
          ),
        })) || [];

      // Split videos into three groups
      this.firstTwoVideos = this.videos.slice(0, 2);
      this.lastTwoVideos = this.videos.slice(2, 4);
      this.bottomVideo = this.videos[4]; // Get the fifth video

      // Process messages
      const messageSection = this.home_content.data.find(
        (section: any) => section.type === 'messages'
      );
      this.messages = messageSection?.data || [];

      // Process images
      this.banner_images = this.home_content.images || [];
      this.banner_img = this.home_content.banner_img;
    } catch (error) {
      console.error('Error fetching home content:', error);
    }
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

  change_lang(lang: any) {
    this.auth.user_language = lang;
    this.translate.use(lang);
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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

      const result = await this.api.uploadImage(this.selectedFile);
      if (result.success && result.data) {
        // After successful upload, update the content using the new image URL
        this.selected_stored_image = result.data;
        await this.useStoredImage();
      } else {
        this.toast('Error uploading image', 'danger');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      this.toast('Error uploading image', 'danger');
    }
  }

  async useStoredImage() {
    if (!this.selected_stored_image) {
      this.toast('Please select an image first', 'warning');
      return;
    }

    try {
      // Create a copy of the current home content
      const updatedContent = { ...this.home_content };

      // Update either banner image or slider images based on selectedImageId
      if (this.selectedImageId === 4) {
        // Banner image
        updatedContent.banner_img = this.selected_stored_image;
      } else {
        // Slider images
        const imageIndex = updatedContent.images.findIndex(
          (img: any) => img.id === this.selectedImageId
        );
        if (imageIndex !== -1) {
          updatedContent.images[imageIndex].link = this.selected_stored_image;
        }
      }

      // Update the content in the database
      const result = await this.api.updateHomeContent(updatedContent);
      if (result.success) {
        await this.getHomeContent();
        this.edit_img_open = false;
        this.toast('Image updated successfully', 'success');
      } else {
        this.toast('Error updating image', 'danger');
      }
    } catch (error) {
      console.error('Error updating image:', error);
      this.toast('Error updating image', 'danger');
    }
  }

  prepareContentForEdit() {
    this.editableContent = {
      data: [
        {
          type: 'videos',
          data: this.videos.map((video) => ({
            link: video.link,
            title: video.title,
            title_p: video.title_p,
            title_s: video.title_s,
            sequence: video.sequence,
          })),
        },
        {
          type: 'messages',
          data: this.messages.map((msg) => ({
            link: msg.link,
            title: msg.title,
            title_p: msg.title_p,
            title_s: msg.title_s,
          })),
        },
      ],
    };
    this.edit_content_open = true;
  }

  async saveContentEdit() {
    try {
      const result = await this.api.updateHomeContent(this.editableContent);
      if (result.success) {
        this.toast('Content updated successfully', 'success');
        this.edit_content_open = false;
        await this.getHomeContent();
      } else {
        this.toast('Error updating content', 'danger');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      this.toast('Error updating content', 'danger');
    }
  }

  async open_edit_img() {
    if (this.auth._user.is_admin === true) {
      try {
        const result = await this.api.getImagesFromStorage();
        if (result.success) {
          this.stored_images =
            result.data?.map((file: any) => ({
              name: file.name,
              url: this.api.supabase.storage
                .from('images')
                .getPublicUrl(`home_page/${file.name}`).data.publicUrl,
            })) || [];
        }
        this.edit_img_open = true;
      } catch (error) {
        console.error('Error loading stored images:', error);
        this.toast('Error loading image library', 'danger');
      }
    }
  }

  async getCredentials() {
    const name = localStorage.getItem('Name');
    const password = localStorage.getItem('Password');
    let user = { user_name: name, password: password };
    let x = await this.auth.login(user);
  }

  ngOnInit() {
    console.log('HomePage initialized');
    this.getCredentials();
  }
}
