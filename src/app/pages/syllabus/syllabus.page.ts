import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonSelect, IonSelectOption, IonTitle, IonMenuButton, IonToolbar, IonButtons, IonSkeletonText, IonAccordionGroup, IonAccordion, IonCol, IonCard, IonLabel, IonCardHeader, IonItem, IonCardContent, IonChip, IonGrid, IonRow, IonIcon, IonInput, IonCheckbox, IonModal, IonButton, IonToast, IonCardSubtitle, IonBackButton } from '@ionic/angular/standalone';
import { VimeoPlayerComponent } from 'src/app/components/vimeo-player/vimeo-player.component';
import { lockClosed, ellipseOutline, addOutline, closeOutline, createOutline, ellipse } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ShortVideosService } from 'src/app/services/short-videos/short-videos.service';
import { LoginService } from 'src/app/services/auth/login.service';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";

addIcons({lockClosed, ellipseOutline, addOutline, closeOutline, createOutline, ellipse})

@Component({
  selector: 'app-syllabus',
  templateUrl: './syllabus.page.html',
  styleUrls: ['./syllabus.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonCardSubtitle, ProfileComponent, IonToast, IonButton, IonSelect, IonSelectOption, IonModal, IonCheckbox, IonInput, IonIcon, IonRow, IonGrid, IonChip, IonCardContent, IonItem, IonCardHeader, IonMenuButton, IonLabel, IonCard, IonCol, IonAccordion, IonAccordionGroup, IonButtons, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, VimeoPlayerComponent, IonSkeletonText, HeaderComponent],
})
export class SyllabusPage implements OnInit {
  route = inject(ActivatedRoute)
  auth = inject(LoginService)
  profile_open = false
  videoId = '1011746589?h=f3d1ddc97e'
  video = {
    id: 0,
    video_id: '1011746589?h=f3d1ddc97e',
    title: '',
    title_s: '',
    title_p: '',    
    is_melody: false,
    student_video_progress: true
  }
  selectedVideo:any
  api = inject(ShortVideosService);
  videos:any = []


  video_to_delete:any = {
    video_id: '',
    title: '',
    title_s: '',
    title_p: '',    
    is_melody: false
  }
  
  video_to_update:any = {
    video_id: '',
    title: '',
    title_s: '',
    title_p: '',    
    is_melody: false
  }
  
  newVid:any = {
    video_id: '',
    title: '',
    title_s: '',
    title_p: '',    
    is_melody: false,
    auto_play_id: 0,
    duration:0
  }

  message: string = '';
  color: string = 'danger';
  duration: number = 3000;
  toastBool = false;

  is_edit = false
  is_delete = false
  editModal = false;

  is_placeholder_video = false
  _class_id_for_placeholder_video:number = 0

  private grade = 0
  
  constructor() {
      addIcons({ellipseOutline,addOutline,createOutline,closeOutline,ellipse,lockClosed});
     
    }

    ngOnInit() {
    
      this.route.queryParams.subscribe(params => {
       this.grade = params['grade']; // Retrieve the passed parameter
        console.log(this.grade);
      });

      this.getVideos(this.grade)
    }

   handleToast(message: string, color: string, duration: number) {
    this.toastBool = true;
    this.message = message;
    this.color = color;
    this.duration = duration;
  }

  voiceScaleChange(event: any) {
    this.auth._user.voice_scale = event.detail.value;
    this.videos = [];
    this.getVideos(this.grade)
  }

  changeVideoProgressStatus(video_id: number) {
 
    this.videos.forEach((level:any) => {
      level.classes.forEach((classItem: any) => {
        const video = classItem.videos.find((v:any) => v.id === video_id);
        if (video) {
          video.student_video_progress = true;
        }
      });
    });
  }

  videoLocked(date: string, locked:boolean, is_melody: boolean) {
        
        if(locked && !this.auth._user.is_admin) {
          if(is_melody && this.isWithinTwoDaysOrPast(date)) {
            return false;
           }
          return true;
        }
        
        else{
          return false;
        }

  }

   isWithinTwoDaysOrPast(dateTimeString: string): boolean {
    // Parse the input string to a Date object
    const inputDate = new Date(dateTimeString);
    
    // Get the current date and time
    const currentDate = new Date();
    
    // If the input date is in the past, return true
    if (inputDate <= currentDate) {
      return true;
    }
    
    // Calculate the difference in milliseconds
    const differenceInTime = inputDate.getTime() - currentDate.getTime();
    
    // Convert milliseconds to days
    const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);
    
    // If the date is in the future but within 2 days, return true
    // Otherwise, return false
    return differenceInDays <= 2;
  }

   
  addVideoFromPlaceholder(_class:any){
    this.newVid.class_id = _class.class_id
    this.newVid.auto_play_id = this.getLastVideoFromPreviousClass(this.videos, _class.class_id).auto_play_id + 1
    console.log(this.newVid.auto_play_id)
    this.newVid.voice_scale = this.selectedVideo.voice_scale
    this.newVid.duration = 0
    this.editModal = true
    this.is_edit = false
  }

  getLastVideoFromPreviousClass(levels: any, targetClassId: number) {
    console.log(levels, targetClassId);
  
    for (let x = 0; x < levels.length; x++) {
      for (let i = 0; i < levels[x].classes.length; i++) {
        const currentClass = levels[x].classes[i];
  
        // If we find the target class, get the previous class
        if (currentClass.class_id === targetClassId) {
          if (i === 0) {
            // If this is the first class in the level, check the previous level
            if (x === 0) {
              // If this is the first class in the first level, return the last video of the last class in the last level
              const lastLevel = levels[levels.length - 1];
              const lastClass = lastLevel.classes[lastLevel.classes.length - 1];
  
              // Return the last video of the last class in the last level if videos exist
              return lastClass.videos.length > 0 ? lastClass.videos[lastClass.videos.length - 1] : null;
            } else {
              // Get the last class of the previous level
              const previousLevel = levels[x - 1];
              const previousClass = previousLevel.classes[previousLevel.classes.length - 1];
  
              // Return the last video of the previous class if videos exist
              return previousClass.videos.length > 0 ? previousClass.videos[previousClass.videos.length - 1] : null;
            }
          } else {
            // Get the previous class in the same level
            const previousClass = levels[x].classes[i - 1];
  
            // Return the last video of the previous class if videos exist
            return previousClass.videos.length > 0 ? previousClass.videos[previousClass.videos.length - 1] : null;
          }
        }
      }
    }
  
    return null; // Target class not found
  }


   async getVideos(grade:number){
    let result:{success:boolean, data?:any, error?:any}
    if(grade < this.auth._user.grade){
      console.log('getting videos')
       result = await this.api.getVideos();
    }
    else{
       result = await this.api.getGradeData(grade);
    }

    if (result.success) {
      // Use result.data
      this.videos = result.data;
      console.log(this.videos)
      this.selectedVideo = this.videos[0].classes[0].videos[0]

       
    } else {

      // Handle the error
      console.error(result.error);
    }
  
    }

    async addVideo(video:any){

      
      
      video.auto_play_id =  (this.is_placeholder_video? this.getLastVideoFromPreviousClass(this.videos, this._class_id_for_placeholder_video).auto_play_id + 1 : this.selectedVideo.auto_play_id + 1)
      video.voice_scale = this.selectedVideo.voice_scale
      video.class_id = (this.is_placeholder_video? this._class_id_for_placeholder_video : this.selectedVideo.class_id)

      console.log(video)

      const result = await this.api.addVideo(video);

      if (result.success) {
        // Use result.data
        this.handleToast('Video added successfully', 'success', 3000)
        this.getVideos(this.grade)
        
        this.newVid = {
          video_id: '',
          title: '',
          title_s: '',
          title_p: '',    
          auto_play_id: 0,
          is_melody: false
        }

        this.editModal = false;
        this.is_placeholder_video = false;
        console.log('Video added successfully');
      } else {
        // Handle the error
        this.handleToast('Video not added', 'danger', 3000)
        console.error(result.error);
      }
    }

    async updateVideo(video:any){
      console.log(video)
      let updated_video = {
        id: video.id,
        video_id: video.video_id,
        title: video.title,
        title_s: video.title_s,
        title_p: video.title_p,    
        is_melody: video.is_melody,
     
      }
      let result = await this.api.updateVideo(updated_video);
      console.warn(result)
      if (result.success) {
        // Use result.data
        this.getVideos(this.grade)
        this.handleToast('Video updated successfully', 'success', 3000)
        this.video_to_update = {
          video_id: '',
          title: '',
          title_s: '',
          title_p: '',    
          is_melody: false
        }
        this.editModal = false;
        this.is_edit = false;
        console.log('Video updated successfully');
      } else {
        // Handle the error
        this.handleToast('Video not updated', 'danger', 3000)
        console.error(result.error);
      }
    }

   async deleteVideo(video:any){
    console.log(video)
      const result = await this.api.deleteVideo(video);
      if (result.success) {
        // Use result.data
        this.getVideos(this.grade)

        this.video_to_delete = {
          video_id: '',
          title: '',
          title_s: '',
          title_p: '',    
          is_melody: false
        }
         this.handleToast('Video deleted successfully', 'success', 3000)
        this.editModal = false;
        this.is_delete = false;
        console.log('Video deleted successfully');
      } else {
        // Handle the error
        this.handleToast('Video not deleted', 'danger', 3000)
        console.error(result.error);
      }
    }



}
