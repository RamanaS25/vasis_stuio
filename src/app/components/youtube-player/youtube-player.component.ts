import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { IonItem, IonLabel, IonCard } from '@ionic/angular/standalone';
@Component({
  selector: 'app-youtube-player',
  templateUrl: './youtube-player.component.html',
  styleUrls: ['./youtube-player.component.scss'],
  standalone: true,
  imports: [IonCard, YouTubePlayerModule, IonItem, IonLabel],
})
export class YoutubePlayerComponent {
  @ViewChild('player', { static: false }) playerElement!: ElementRef;
  @Input() videoUrl: string = 'your_full_youtube_url';

  currentTime: number = 0;
  duration: number = 0;

  parseFloat = parseFloat;
  sanitizedVideoUrl: any;

  constructor(private sanitizer: DomSanitizer) {
    console.log('initing')
    console.log(this.videoUrl)
  }





  ngAfterViewInit(): void {

    console.log('videoLink', this.videoUrl)
    this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl( 'https://www.youtube.com/embed/' + this.extractVideoId(this.videoUrl))
    
    console.log("new link", this.sanitizedVideoUrl)    
  }

 

  private extractVideoId(url: string): string | null {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=)|(shorts\/)|(\?feature=share\&v=))([^#&?]*).*/;
    const match = url?.match(regExp);
    if (match && match[9].length == 11) {
      return match[9];
    } else {
     return null
    }
  }
  


  ngOnChanges(changes: SimpleChanges){
    console.log('changes',changes)
        console.log('new video',changes['videoUrl'].currentValue)
        this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://www.youtube.com/embed/' + this.extractVideoId(changes['videoUrl'].currentValue)
        );
        console.log("new link change", this.sanitizedVideoUrl)  
        // this.loadNewVideo(id)
       
  }

}
