import { Component, ElementRef, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { IonItem, IonLabel, IonCard, IonIcon } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { playOutline, pauseOutline, volumeHighOutline, volumeLowOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: any;
  }
}

@Component({
  selector: 'app-youtube-player',
  templateUrl: './youtube-player.component.html',
  styleUrls: ['./youtube-player.component.scss'],
  standalone: true,
  imports: [IonCard, YouTubePlayerModule, IonItem, IonLabel, IonIcon, CommonModule, FormsModule ],
})
export class YoutubePlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('youtubeVideoContainer') youtubeVideoContainer!: ElementRef;
  @Input() videoUrl: string = '';

  player: any;
  videoDuration: number = 0;
  currentTime: number = 0;
  seeking: boolean = false;
  currentVolume: number = 50;
  isPlaying: boolean = false;
  seekSubject = new Subject<number>();

  constructor(private sanitizer: DomSanitizer) {
    addIcons({chevronBackOutline,playOutline,pauseOutline,chevronForwardOutline,volumeHighOutline,volumeLowOutline});
  }

  ngOnInit() {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        this.loadPlayer();
      };
    } else {
      this.loadPlayer();
    }

    setInterval(() => {
      if (this.player && !this.seeking) {
        this.currentTime = this.player.getCurrentTime();
      }
    }, 500);

    setInterval(() => {
      if (this.player) {
        this.currentVolume = this.player.getVolume();
      }
    }, 500);

    this.seekSubject.pipe(debounceTime(250)).subscribe((time: number) => {
      this.seekVideo(time);
    });
  }

  ngAfterViewInit(): void {
    this.loadPlayer();
  }

  private loadPlayer(): void {
    if (!this.youtubeVideoContainer?.nativeElement) {
      return;
    }

    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
  
    const videoId = this.extractVideoId(this.videoUrl);
    if (!videoId) {
      console.error('Invalid YouTube URL');
      return;
    }
  
    this.player = new window.YT.Player(this.youtubeVideoContainer.nativeElement, {
      width: '100%',
      height: '100%',
      videoId,
      playerVars: {
        controls: 0,
        modestbranding: 1,
        rel: 0
      },
      events: {
        onReady: (event: any) => {
          console.log('Player is ready:', event.target);
          this.player = event.target;
        },
        onStateChange: (event: any) => {
          console.log('Player state changed:', event.data);
          if (event.data === window.YT.PlayerState.PLAYING) {
            this.isPlaying = true;
            this.seeking = false;
            this.videoDuration = this.player.getDuration();
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            this.isPlaying = false;
          }
        }
      },
    });
  }

  playVideo(): void {
    if (this.player) {
      this.isPlaying = true;
      this.player.playVideo();
    }
  }

  pauseVideo(): void {
    if (this.player) {
      this.isPlaying = false;
      this.player.pauseVideo();
    }
  }

  seekVideo(time: number): void {
    if (this.player) {
      this.seeking = true;
      this.player.seekTo(time, true);
      this.updateCurrentTime();
    }
  }

  updateCurrentTime(): void {
    if (this.player && !this.seeking) {
      this.currentTime = this.player.getCurrentTime();
    }
  }

  setVolume(volume: number): void {
    if (this.player) {
      this.player.setVolume(volume);
    }
  }

  skipAhead(): void {
    if (this.player && this.player.getPlayerState() === window.YT.PlayerState.PLAYING) {
      const newTime = this.player.getCurrentTime() + 15;
      this.currentTime = newTime > this.videoDuration ? this.videoDuration : newTime;
      this.seekVideo(this.currentTime);
    }
  }
  
  skipBehind(): void {
    if (this.player && this.player.getPlayerState() === window.YT.PlayerState.PLAYING) {
      const newTime = this.player.getCurrentTime() - 15;
      this.currentTime = newTime < 0 ? 0 : newTime;
      this.seekVideo(this.currentTime);
    }
  }

  private extractVideoId(url: string): string | null {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=)|(shorts\/)|(\?feature=share\&v=))([^#&?]*).*/;
    const match = url?.match(regExp);
    if (match && match[9].length == 11) {
      return match[9];
    }
    return null;
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.destroy();
    }
  }
}
