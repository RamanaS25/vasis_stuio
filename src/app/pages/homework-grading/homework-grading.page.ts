import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonRow, IonGrid, IonCard, IonCardHeader, IonButtons, IonBackButton, IonToast, IonCardContent, IonItem, IonNote, IonSkeletonText, IonButton, IonIcon, IonLabel, IonInput, IonRange, IonTextarea, IonCardTitle, IonCardSubtitle, IonList, IonAvatar, IonBadge, IonToggle } from '@ionic/angular/standalone';
import { HomeworkmService } from 'src/app/services/homeworkm/homeworkm.service';
import { MuxVideoPlayerComponent } from "../../components/mux-video-player/mux-video-player.component";
import { addIcons } from 'ionicons';
import { arrowBackOutline, documentText, checkmarkCircle,arrowBack, logoWhatsapp, trash } from 'ionicons/icons';
import { AudioRecorderComponent } from "../../components/audio-recorder/audio-recorder.component";
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-homework-grading',
  templateUrl: './homework-grading.page.html',
  styleUrls: ['./homework-grading.page.scss'],
  standalone: true,
  imports: [IonToggle, IonBadge, IonAvatar, IonList, IonCardSubtitle, IonCardTitle, IonTextarea, IonInput, IonLabel, IonIcon, IonButton, IonSkeletonText, IonNote, IonItem, IonCardContent, IonToast, IonBackButton, IonButtons, IonCardHeader, IonCard, IonGrid, IonRow, IonCol, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, MuxVideoPlayerComponent, IonRange, AudioRecorderComponent, HeaderComponent]
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
audio_url:any = 'No Audio'
homework_graded_object:any = {
  id:0,
  val_1: 0,
  val_2: 0,
  val_3: 0,
  val_4: 0,
  avg: 0,
  comment: '',
  audio_url: '',
  graded:true
}
is_graded = false
  constructor() {
      addIcons({arrowBack,documentText,logoWhatsapp,checkmarkCircle,trash,arrowBackOutline}); }

  ngOnInit() {
    this.fetchGroups(this.is_graded)
  }

  navigateToWhatsApp(number: string, message: string) {
    if (!number) {
      this.toastHandler('No phone number available for this student', 'warning');
      return;
    }

    // Remove any non-digit characters and ensure it starts with a country code
    const cleanNumber = number.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      this.toastHandler('Invalid phone number format' + ' ' + cleanNumber, 'warning');
      return;
    }

    let m = 'Haribol' + ' ' + ((this.selectedStudent.initiatedName &&  this.selectedStudent.initiatedName != 'undefined') ? this.selectedStudent.initiatedName : this.selectedHomework.studentName ) + ', your homework: ' + this.selectedHomework.description + ' has been graded! Click the following link to view: https://vasis-studio.web.app '
    let ms = 'Haribol' + ' ' + ((this.selectedStudent.initiatedName &&  this.selectedStudent.initiatedName != 'undefined') ? this.selectedStudent.initiatedName : this.selectedHomework.studentName ) + ', tu tarea: ' + this.selectedHomework.des_sp + ' ya ha sido corregida, haz click en el enlace para verla: https://vasis-studio.web.app';
    let mp = 'Haribol' + ' ' + ((this.selectedStudent.initiatedName &&  this.selectedStudent.initiatedName != 'undefined') ? this.selectedStudent.initiatedName : this.selectedHomework.studentName ) + ', seu dever de casa: ' + this.selectedHomework.des_p + ' foi avaliado! Clique no link a seguir para visualizá-lo: https://vasis-studio.web.app';

    const encodedMessage = encodeURIComponent((this.selectedStudent.language == 'Spanish') ? ms : (this.selectedStudent.language == 'Portuguese') ? mp : m);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }
  
  toastHandler(message:string, color:string){
    this.toast.isOpen = true
    this.toast.message = message
    this.toast.color = color
  }

  changeIsGraded(event:any){
    this.student_selected = false
    this.is_graded = event.detail.checked
    this.selectedHomework = false
    this.fetchGroups(this.is_graded)
  }

  async fetchGroups(is_graded:boolean){
    const res = await this.api.get_groups_with_students_homework(is_graded)
    if(res.success){
      console.log(res.data)
      this.groups = res.data
    }else{
      this.toastHandler(res.error || 'Error fetching groups', 'danger')
    }
  }

  selectGroup(group:any){
    this.selectedGroup = group
    this.selectedHomework = false
    this.student_selected = false
  }

  selectStudent(student:any){
    this.selectedStudent = student
    this.student_selected = true
  }

  selectHomework(homework:any){
    this.selectedHomework = homework
    if(this.is_graded){
      this.homework_graded_object = homework
    }
  }

  avgCalc(event:any){
    this.homework_graded_object.avg = (this.homework_graded_object.val_1 + this.homework_graded_object.val_2 + this.homework_graded_object.val_3 + this.homework_graded_object.val_4) / 4;
  }

  async deleteHomework(){
    const res = await this.api.delete_homework_from_student(this.selectedStudent.id, this.selectedHomework.id)
    if(res.success){

      this.selectedStudent.student_homework = this.selectedStudent.student_homework.filter((item:any) => item.id !== this.selectedHomework.id)
      this.selectedHomework = false
      this.toastHandler('Homework deleted successfully', 'success')
    }
  }

  async submitGrades(){
    this.homework_graded_object.id = this.selectedHomework.id
    this.homework_graded_object.graded = true
    this.homework_graded_object.audio_url = this.audio_url
    console.log(this.homework_graded_object)
    const res = await this.api.submit_homework_grades(this.homework_graded_object)

    if(res.success){
      this.toastHandler('Grades submitted successfully', 'success')
      
      // Remove the graded homework from the student's homework array
      if (this.selectedStudent && this.selectedStudent.student_homework) {
        this.selectedStudent.student_homework = this.selectedStudent.student_homework.filter((item:any) => item.id !== this.selectedHomework.id)
        
        // If this was the last homework for this student, they might need to be removed from the view
        if (this.selectedStudent.student_homework.length === 0 && this.selectedGroup) {
          // Update the group's students array to remove students with no homework
          this.selectedGroup.students = this.selectedGroup.students.filter((student:any) => 
            student.id !== this.selectedStudent.id || student.student_homework.length > 0
          );
        }
      }
      
      // Reset the homework graded object
      this.homework_graded_object = {
        id: 0,
        val_1: 0,
        val_2: 0,
        val_3: 0,
        val_4: 0,
        avg: 0,
        comment: '',
        audio_url: '',
        graded: true
      }
      
      this.selectedHomework = null;
      this.student_selected = false;
      
      // Refresh the groups with the updated data
      this.fetchGroups(this.is_graded);
    } else {
      this.toastHandler(res.error || 'Error submitting grades', 'danger')
    }
  }

}
