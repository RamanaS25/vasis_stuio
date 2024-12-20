import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonGrid, IonRow, IonCol, IonCard, IonToast, IonItem, IonSelect, IonSelectOption, IonModal, IonBackButton, IonLoading, IonChip, IonLabel, IonBadge, IonNote, IonList, IonCardContent, IonIcon, IonCardHeader, IonButtons } from '@ionic/angular/standalone';
import { Homework, MuxVideoService } from 'src/app/services/mux/mux-video.service';
import { LoginService } from '../../services/auth/login.service';
import { addIcons } from 'ionicons';
import { closeOutline, albums, cloudUpload, chevronForward, arrowBack } from 'ionicons/icons';
import { MuxVideoPlayerComponent } from "../../components/mux-video-player/mux-video-player.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-homework-submission',
  templateUrl: './homework-submission.page.html',
  styleUrls: ['./homework-submission.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonCardHeader, 
    IonIcon,
    IonCardContent,
    IonList,
    IonNote,
    IonBadge,
    IonLabel,
    IonItem,
    IonToast,
    IonCard,
    IonCol,
    IonRow, 
    IonGrid,
    IonInput,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSelect,
    IonSelectOption,
    IonModal,
    CommonModule,
    FormsModule,
    IonLoading,
    IonChip,
    IonBackButton,
    MuxVideoPlayerComponent
  ],

})
export class HomeworkSubmissionPage implements OnInit {
  video_api = inject(MuxVideoService);
  auth = inject(LoginService);
  route = inject(ActivatedRoute);
  selectedFile: File | null = null;  // The selected video file
  uploadedUrl: string | null = null;  // The public URL of the uploaded video
  type: string = 'cloud-upload';
  homework: Homework[] = [];
  selectedHomework_upload:any | null = null;
  homework_ = signal<any>(null);

  filteredHomework = computed(() => {
    console.warn('selectedClass',this.selectedClass())
    return this.homework_()?.filter((item:any) => item.class_id?.name === this.selectedClass());
  }); 

  homework_length = computed(() => {

    return this.filteredHomework().length;
  });

  selectedHomework:Homework | null = null;

  selectedClass = signal<string>('Class 1')
  
  toastBool = false;
  message = "";
  color = "";

  numbers: number[] = Array.from({length: 24}, (_, i) => i + 1);

  modalBool = false;

  grade = 0

  video_upload_loading = false

  constructor() {
     
      addIcons({albums,cloudUpload,closeOutline,chevronForward,arrowBack});

   }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file && file.type.startsWith('video/')) {
      this.selectedFile = file;  // Only accept video files
    } else {
      alert('Please select a valid video file.');
    }
  }


  async uploadVideo(): Promise<void> {
    this.video_upload_loading = true;
    if (this.selectedFile) {
      try {
        const res = await this.video_api.uploadToStorage(this.selectedFile);
        this.uploadedUrl = res.data!;  // Set the public URL once uploaded

        if(res.success && this.selectedHomework){
          let response = await this.video_api.uploadVideo(res.data!, this.auth._user.id, this.selectedHomework);
          console.log(response)

          if(response.success){
            this.toast('Video uploaded successfully', 'success');
            this.modalBool = false;
            this.getHomework(this.grade);
            this.video_upload_loading = false;

          }
          else{
            this.toast('Error uploading Video', 'danger');
            this.video_upload_loading = false;
          }

         }else{
          this.toast(res.error!, 'danger');
         }

         this.video_upload_loading = false;

    
      } catch (error) {
        console.error('Error uploading video:', error);
        this.video_upload_loading = false;
      }
    }
  }

  toast(message: string, color: string){
    this.toastBool = true;
    this.message = message;
    this.color = color;
  }

  async getHomework(grade:number){
    console.warn('grade',grade)
    let res = await this.video_api.getHomeworkByGrade(grade, this.auth._user.id);
    console.log('res',res)
    if(res.success){

      this.homework_.set(res.data!)
      console.log(this.filteredHomework())
   
    }else{
      this.toast('Error fetching Homework', 'danger');
    }
  }

  ngOnInit() {
    console.log('Hello HomeworkSubmissionPage Page');

    this.route.queryParams.subscribe((params: { [x: string]: number; }) => {
      this.grade = params['grade']; // Retrieve the passed parameter
       console.log(this.grade);
       this.getHomework(this.grade)
     });
     console.log('afasef',this.grade)


  }

}
