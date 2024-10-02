import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import Player from '@vimeo/player';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-vimeo-player',
  templateUrl: './vimeo-player.component.html',
  styleUrls: ['./vimeo-player.component.scss'],
  standalone:true
})
export class VimeoPlayerComponent implements OnChanges, AfterViewInit {
  @Input() videoId: string = '1011746589?h=f3d1ddc97e';
  @ViewChild('playerContainer') playerContainer!: ElementRef;

  safeVideoUrl!: SafeResourceUrl;
  private player!: Player;

  constructor(private sanitizer: DomSanitizer) { }

  ngAfterViewInit() {
    // Delay the player initialization to ensure the iframe is fully loaded
    setTimeout(() => this.initializePlayer(), 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['videoId']) {
      this.updateVideoUrl();
    }
  }

  private updateVideoUrl() {
    const videoUrl = `https://player.vimeo.com/video/${this.videoId}`;
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }

  private initializePlayer() {
    this.player = new Player(this.playerContainer.nativeElement);
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.player.on('play', () => console.log('Video played'));
    this.player.on('pause', () => console.log('Video paused'));
    this.player.on('ended', () => console.log('Video finished'));
  }
}
