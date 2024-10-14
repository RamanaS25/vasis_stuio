import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import Player from '@vimeo/player';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ShortVideosService } from 'src/app/services/short-videos/short-videos.service';
import { LoginService } from 'src/app/services/auth/login.service';

@Component({
  selector: 'app-vimeo-player',
  templateUrl: './vimeo-player.component.html',
  styleUrls: ['./vimeo-player.component.scss'],
  standalone: true
})
export class VimeoPlayerComponent implements OnChanges, AfterViewInit {
  @Input() video = { id: 0, video_id: '1011746589?h=f3d1ddc97e', title: '', title_s: '', title_p: '', student_video_progress: true, is_melody: false };
  @Output() videoId = new EventEmitter<number>();
  @ViewChild('playerContainer') playerContainer!: ElementRef;
  videos_service = inject(ShortVideosService);
  auth = inject(LoginService);
  safeVideoUrl!: SafeResourceUrl;
  private player!: Player;

  constructor(private sanitizer: DomSanitizer) {
    this.updateVideoUrl();
  }

  ngAfterViewInit() {
    // Delay the player initialization to ensure the iframe is fully loaded
    setTimeout(() => this.initializePlayer(), 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['video'] && !changes['video'].firstChange) {
      console.log(changes['video'], 'video changes detected');
      this.updateVideoUrl();
      this.loadVideo();
    }
  }

  private updateVideoUrl() {
    const videoUrl = `https://player.vimeo.com/video/${this.video.video_id}`;
    console.log(videoUrl);
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }

  private initializePlayer() {
    this.player = new Player(this.playerContainer.nativeElement);
    this.setupEventListeners();
    this.loadVideo(); // Load the initial video when the player is initialized
  }

  private setupEventListeners() {
    console.log('Setting up event listeners');
    this.player.on('play', () => console.log('Video played'));
    this.player.on('pause', () => console.log('Video paused'));
    this.player.on('ended', () => {
    
      if (!this.video.student_video_progress) {
        this.saveVideoProgress({ video_id: this.video.id, student_id: this.auth._user.id });
      }
    });
  }

  private loadVideo() {

    if (this.player) {
      let self = this;
      const url = `https://player.vimeo.com/video/${this.video.video_id}`;
      console.log(url)
      // Load the video using the full video ID with the h hash (e.g., '815343158?h=98f8e24de4')
      this.player.loadVideo(url).then(function(url) {
        // the video successfully loaded
            console.log("sup1")

             self.setupEventListeners();
          }).catch(function(error) {
            switch (error.name) {
                case 'TypeError':
                    // the id was not a number
                    console.warn(error.name)
                    break;
    
                case 'PasswordError':
                    // the video is password-protected and the viewer needs to enter the
                    // password first
                    break;
    
                case 'PrivacyError':
                    // the video is password-protected or private
                    break;
    
                default:
                    // some other error occurred
                    break;
            }
        });
    }
  }
  
  async saveVideoProgress(video_progress: { video_id: number, student_id: number }) {

    let x = await this.videos_service.saveVideoProgress(video_progress);

    if (x.success) {
    
      this.videoId.emit(video_progress.video_id);
    }
  }
  
}
