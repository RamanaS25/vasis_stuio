import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonRow, IonGrid, IonCard, IonCardHeader, IonButtons, IonBackButton, IonToast, IonCardContent, IonItem, IonNote, IonSkeletonText, IonButton, IonIcon, IonLabel, IonInput, IonRange, IonTextarea, IonCardTitle, IonCardSubtitle, IonList, IonAvatar, IonBadge } from '@ionic/angular/standalone';
import { HomeworkmService } from 'src/app/services/homeworkm/homeworkm.service';
import { MuxVideoPlayerComponent } from "../../components/mux-video-player/mux-video-player.component";
import { addIcons } from 'ionicons';
import { arrowBackOutline, documentText, checkmarkCircle,arrowBack } from 'ionicons/icons';
import { AudioRecorderComponent } from "../../components/audio-recorder/audio-recorder.component";

@Component({
  selector: 'app-homework-grading',
  templateUrl: './homework-grading.page.html',
  styleUrls: ['./homework-grading.page.scss'],
  standalone: true,
  imports: [IonBadge, IonAvatar, IonList, IonCardSubtitle, IonCardTitle, IonTextarea, IonInput, IonLabel, IonIcon, IonButton, IonSkeletonText, IonNote, IonItem, IonCardContent, IonToast, IonBackButton, IonButtons, IonCardHeader, IonCard, IonGrid, IonRow, IonCol, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, MuxVideoPlayerComponent, IonRange, AudioRecorderComponent]
})
export class HomeworkGradingPage implements OnInit {
api = inject(HomeworkmService)
toast = {
  isOpen: false,
  message: '',
  color: 'danger'
}
groups:any[] = []
selectedGroup:any
selectedStudent:any
homework_selected = false
selectedHomework:any
student_selected:any

homework_graded_object:any = {
  id:0,
  val1: 0,
  val2: 0,
  val3: 0,
  val4: 0,
  avg: 0,
  comment: '',
  audio_link: '',
  graded:true
}
  constructor() {
      addIcons({arrowBack,documentText,checkmarkCircle,arrowBackOutline}); }

  ngOnInit() {
    this.fetchGroups()
  }

  async fetchGroups(){
    const res = await this.api.get_groups_with_students_homework()
    if(res.success){
      console.log(res.data)
      this.groups = res.data
    }else{
      this.toast.isOpen = true
      this.toast.message = res.error || 'Error fetching groups'
    }
  }

  selectGroup(group:any){
    this.selectedGroup = group
  }

  selectStudent(student:any){
    this.selectedStudent = student
    this.student_selected = true
  }

  selectHomework(homework:any){
    this.selectedHomework = homework
  }

  avgCalc(event:any){
    this.homework_graded_object.avg = (this.homework_graded_object.val1 + this.homework_graded_object.val2 + this.homework_graded_object.val3 + this.homework_graded_object.val4) / 4;
  }

}
