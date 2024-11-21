import { CommonModule } from '@angular/common';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import "@mux/mux-player"
@Component({
  selector: 'app-mux-video-player',
  templateUrl: './mux-video-player.component.html',
  styleUrls: ['./mux-video-player.component.scss'],
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MuxVideoPlayerComponent  implements OnInit {
  @Input() video_link: string = '';
  constructor() { }

  ngOnInit() {}

}
