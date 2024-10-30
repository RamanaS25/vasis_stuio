import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  Output,
  EventEmitter,
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
  @Output() selectImg = new EventEmitter<{ id: number; link: string }>();

  @Input() _images = [
    { link: '../../../assets/img/banner0802.jpg', id: 1 },
    { link: '../../../assets/img/banner0802.jpg', id: 2 },
    { link: '../../../assets/img/banner0802.jpg', id: 3 },
  ];

  select_img: number = 0;
  selectedFile: File | null = null;

  constructor() {}

  selectImage(x: { id: number; link: string }) {
    this.selectImg.emit(x);
  }
  ngOnInit() {
    console.log('swiper');
  }
}
