import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonMenuButton, IonToolbar, IonButtons, IonSkeletonText, IonAccordionGroup, IonAccordion, IonCol, IonCard, IonLabel, IonCardHeader, IonItem, IonCardContent, IonChip, IonGrid, IonRow, IonIcon, IonInput, IonCheckbox, IonModal, IonButton, IonToast } from '@ionic/angular/standalone';
import { VimeoPlayerComponent } from 'src/app/components/vimeo-player/vimeo-player.component';
import { lockClosed, ellipseOutline, addOutline, closeOutline, createOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ShortVideosService } from 'src/app/services/short-videos/short-videos.service';
addIcons({lockClosed, ellipseOutline, addOutline, closeOutline, createOutline})

@Component({
  selector: 'app-syllabus',
  templateUrl: './syllabus.page.html',
  styleUrls: ['./syllabus.page.scss'],
  standalone: true,
  imports: [IonToast, IonButton, IonModal, IonCheckbox, IonInput, IonIcon, IonRow, IonGrid, IonChip, IonCardContent, IonItem, IonCardHeader,IonMenuButton, IonLabel, IonCard, IonCol, IonAccordion, IonAccordionGroup, IonButtons, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, VimeoPlayerComponent, IonSkeletonText],
})
export class SyllabusPage implements OnInit {
  videoId = '1011746589?h=f3d1ddc97e'
  selectedVideo:any
  api = inject(ShortVideosService);
  videos:any
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

  
  constructor() {
      addIcons({ellipseOutline,lockClosed});
       this.getVideos()
    }
   handleToast(message: string, color: string, duration: number) {
    this.message = message;
    this.color = color;
    this.duration = duration;
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

  getLastVideoFromPreviousClass(levels:any, targetClassId:number) {
    for (let level of levels) {
      for (let i = 0; i < level.classes.length; i++) {
        const currentClass = level.classes[i];
  
        // If we find the target class, get the previous class
        if (currentClass.class_id === targetClassId) {
          if (i === 0) {
            // If this is the first class in the level, there is no previous class
            return null;
          }
  
          const previousClass = level.classes[i - 1];
  
          // Return the last video of the previous class if videos exist
          if (previousClass.videos.length > 0) {
            return previousClass.videos[previousClass.videos.length - 1];
          } else {
            return null; // No videos in the previous class
          }
        }
      }
    }
  
    // Return null if the target class wasn't found
    return null;
  }
  

   async getVideos(){
    const result = await this.api.getGradeOneData(1);
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

      console.log(video, this._class_id_for_placeholder_video, this.selectedVideo.class_id )
      
      video.auto_play_id =  (this.is_placeholder_video? this.getLastVideoFromPreviousClass(this.videos, this._class_id_for_placeholder_video).auto_play_id + 1 : this.selectedVideo.auto_play_id + 1)
      video.voice_scale = this.selectedVideo.voice_scale
      video.class_id = (this.is_placeholder_video? this._class_id_for_placeholder_video : this.selectedVideo.class_id)

      console.log(video)

      const result = await this.api.addVideo(video);

      if (result.success) {
        // Use result.data
        this.handleToast('Video added successfully', 'success', 3000)
        this.getVideos()
        
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
      const result = await this.api.updateVideo(video);
      if (result.success) {
        // Use result.data
        this.getVideos()
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
        this.getVideos()

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

  ngOnInit() {
    console.log('syllabus')
  }

}
