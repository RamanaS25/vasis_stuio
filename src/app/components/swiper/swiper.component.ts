import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
} from '@angular/core';
import { HomeService } from 'src/app/services/home/home.service';
import { register } from 'swiper/element/bundle';
import { IonModal, IonInput } from '@ionic/angular/standalone';
register();
@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonModal, IonInput],
})
export class SwiperComponent implements OnInit {
  api = inject(HomeService);
  images = ['banner0802.jpg', 'banner0802.jpg', 'banner0802.jpg'];
  img: string = 'pct2.jpg';
  text: any;
  edit_open: boolean = false;
  select_img: number = 0;
  selectedFile: File | null = null;
  constructor() {
    this.getText();
  }
  async getText() {
    let x = await this.api.getHome();
    this.text = x.data;

    this.images[0] = this.text[0].img;
    this.images[1] = this.text[1].img;
    this.images[2] = this.text[2].img;

    //await this.getImage();
    console.log(this.text);
    console.log('blyaaa', this.images);
  }

  // async getImage() {
  //   for (let i = 0; i < 3; i++) {
  //     let x = await this.api.getImage(this.images[i]);
  //     console.log('ramanaaa', x);
  //     if (x !== null) {
  //       this.img = x;
  //       this.images[i] = this.img;
  //     }
  //   }
  // }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('Файл выбран:', file);
    }
  }

  async uploadImage(id: number) {
    let x = await this.api.uploadImage(this.selectedFile, id);
    if (x !== null) {
      this.img = x;
    }
  }
  ngOnInit() {}
}
