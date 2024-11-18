import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonGrid, IonRow, IonCol, IonCard, IonToast, IonItem, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { MuxVideoService } from 'src/app/services/mux/mux-video.service';
import { LoginService } from '../../services/auth/login.service';
import "@mux/mux-player"
@Component({
  selector: 'app-homework-submission',
  templateUrl: './homework-submission.page.html',
  styleUrls: ['./homework-submission.page.scss'],
  standalone: true,
  imports: [IonItem, IonToast, IonCard, IonCol, IonRow, IonGrid, IonInput, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption, CommonModule, FormsModule],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeworkSubmissionPage implements OnInit {
  video_api = inject(MuxVideoService);
  auth = inject(LoginService);
  selectedFile: File | null = null;  // The selected video file
  uploadedUrl: string | null = null;  // The public URL of the uploaded video
  homework: any[] = [];

  homework_ = signal<any>(null);

  filteredHomework = computed(() => {
    console.log(this.selectedClass())
    return this.homework_()?.filter((item:any) => item.class_id.name === this.selectedClass());
  });

  homework_length = computed(() => {

    return this.filteredHomework().length;
  });

  selectedClass = signal<string>('Class 1')
  toastBool = false;
  message = "";
  color = "";

  playbackId = "j721S8OG02S01s02SSGf9900cJvgTChzyxDdvdQ01101RNELg";

  numbers: number[] = Array.from({length: 24}, (_, i) => i + 1);

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
          let response = await this.video_api.uploadVideo(res.data!, this.auth._user.id);
          console.log(response)
          if(response.success){
            this.playbackId = response.data!
          }
         }

    
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
  }

  toast(message: string, color: string){
    this.toastBool = true;
    this.message = message;
    this.color = color;
  }

  async getHomework(){
    let res = await this.video_api.getHomeworkByGrade(this.auth._user.grade);

    if(res.success){

      this.homework_.set(res.data!)
      console.log(this.filteredHomework())
   
    }else{
      this.toast('Error fetching Homework', 'danger');
    }
  }

  ngOnInit() {
    console.log('Hello HomeworkSubmissionPage Page');
    this.getHomework();
  }

}
