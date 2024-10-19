import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput } from '@ionic/angular/standalone';
import { MuxVideoService } from 'src/app/services/mux/mux-video.service';
import "@mux/mux-player"
@Component({
  selector: 'app-homework-submission',
  templateUrl: './homework-submission.page.html',
  styleUrls: ['./homework-submission.page.scss'],
  standalone: true,
  imports: [IonInput, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeworkSubmissionPage implements OnInit {
  video_api = inject(MuxVideoService);

  selectedFile: File | null = null;  // The selected video file
  uploadedUrl: string | null = null;  // The public URL of the uploaded video

  
  playbackId = "YguAMmPcBgeQXkQaXnR9Aup8JZiEsKThYg94Lt1RuAw";

  constructor() { }


  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file && file.type.startsWith('video/')) {
      this.selectedFile = file;  // Only accept video files
    } else {
      alert('Please select a valid video file.');
    }
  }

  async uploadVideo(): Promise<void> {
    if (this.selectedFile) {
      try {
        const res = await this.video_api.uploadToStorage(this.selectedFile);
        this.uploadedUrl = res.data!;  // Set the public URL once uploaded

        if(res.success){
          let mux_playback_id = await this.video_api.uploadVideo(res.data!);
          console.log(mux_playback_id)
         }

    
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
  }

  ngOnInit() {
    console.log('Hello HomeworkSubmissionPage Page');
  }

}
