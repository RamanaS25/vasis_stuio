import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonCol,
  IonRow,
  IonGrid,
  IonCard,
  IonCardHeader,
  IonToast,
  IonCardContent,
  IonItem,
  IonNote,
  IonSkeletonText,
  IonButton,
  IonIcon,
  IonLabel,
  IonRange,
  IonTextarea,
  IonCardTitle,
  IonCardSubtitle,
  IonList,
  IonBadge,
  IonToggle,
} from '@ionic/angular/standalone';
import { HomeworkmService } from 'src/app/services/homeworkm/homeworkm.service';
import { MuxVideoPlayerComponent } from '../../components/mux-video-player/mux-video-player.component';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  documentText,
  checkmarkCircle,
  arrowBack,
  logoWhatsapp,
  trash,
} from 'ionicons/icons';
import { AudioRecorderComponent } from '../../components/audio-recorder/audio-recorder.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-homework-grading',
  templateUrl: './homework-grading.page.html',
  styleUrls: ['./homework-grading.page.scss'],
  standalone: true,
  imports: [
    IonToggle,
    IonBadge,
    IonList,
    IonCardSubtitle,
    IonCardTitle,
    IonTextarea,
    IonLabel,
    IonIcon,
    IonButton,
    IonSkeletonText,
    IonNote,
    IonItem,
    IonCardContent,
    IonToast,
    IonCardHeader,
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    IonContent,
    CommonModule,
    FormsModule,
    MuxVideoPlayerComponent,
    IonRange,
    AudioRecorderComponent,
    HeaderComponent,
  ],
})
export class HomeworkGradingPage implements OnInit {
  api = inject(HomeworkmService);
  toast = {
    isOpen: false,
    message: '',
    color: 'danger',
  };
  groups: any[] = [];
  selectedGroup: any;
  selectedStudent: any;
  homework_selected = false;
  selectedHomework: any;
  student_selected: any;
  audio_url: any = 'No Audio';
  homework_graded_object: any = {
    id: 0,
    val_1: 0,
    val_2: 0,
    val_3: 0,
    val_4: 0,
    avg: 0,
    comment: '',
    audio_url: '',
    graded: true,
  };
  is_graded = false;
  constructor() {
    addIcons({
      arrowBack,
      documentText,
      logoWhatsapp,
      checkmarkCircle,
      trash,
      arrowBackOutline,
    });
  }

  ngOnInit() {
    this.fetchGroups(this.is_graded);
  }

  navigateToWhatsApp(number: string) {
    if (!number) {
      this.toastHandler(
        'No phone number available for this student',
        'warning'
      );
      return;
    }

    // Remove any non-digit characters and ensure it starts with a country code
    const cleanNumber = number.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      this.toastHandler(
        'Invalid phone number format' + ' ' + cleanNumber,
        'warning'
      );
      return;
    }

    console.log(this.selectedStudent);

    let initiatedName = this.selectedStudent.initiated_name;
    let displayName =
      initiatedName && initiatedName !== 'undefined' && initiatedName !== null
        ? initiatedName
        : this.selectedStudent.legal_name;

    console.log(displayName);
    console.log(initiatedName);
    console.log(this.selectedHomework);
    let m = `Haribol ${displayName}, your homework: ${this.selectedHomework.syllabus_homework.title} has been graded! Click the following link to view: https://vasis-studio.vercel.app/home`;
    let ms = `Haribol ${displayName}, tu tarea: ${this.selectedHomework.syllabus_homework.title_s} ya ha sido corregida, haz click en el enlace para verla: https://vasis-studio.vercel.app/home`;
    let mp = `Haribol ${displayName}, seu dever de casa: ${this.selectedHomework.syllabus_homework.title_p} foi avaliado! Clique no link a seguir para visualizá-lo: https://vasis-studio.vercel.app/home`;

    const encodedMessage = encodeURIComponent(
      this.selectedStudent.language == 'Spanish'
        ? ms
        : this.selectedStudent.language == 'Portuguese'
        ? mp
        : m
    );
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }

  toastHandler(message: string, color: string) {
    this.toast.isOpen = true;
    this.toast.message = message;
    this.toast.color = color;
  }

  changeIsGraded(event: any) {
    this.student_selected = false;
    this.is_graded = event.detail.checked;
    this.selectedHomework = false;
    this.fetchGroups(this.is_graded);
  }

  async fetchGroups(is_graded: boolean) {
    const res = await this.api.get_groups_with_students_homework(is_graded);
    if (res.success) {
      console.log(res.data);
      this.groups = res.data;
    } else {
      this.toastHandler(res.error || 'Error fetching groups', 'danger');
    }
  }

  selectGroup(group: any) {
    this.selectedGroup = group;
    this.selectedHomework = false;
    this.student_selected = false;
  }

  selectStudent(student: any) {
    this.selectedStudent = student;
    this.student_selected = true;
  }

  selectHomework(homework: any) {
    this.selectedHomework = homework;
    if (this.is_graded) {
      this.homework_graded_object = homework;
    }
  }

  avgCalc(event: any) {
    this.homework_graded_object.avg =
      (this.homework_graded_object.val_1 +
        this.homework_graded_object.val_2 +
        this.homework_graded_object.val_3 +
        this.homework_graded_object.val_4) /
      4;
  }

  async deleteHomework() {
    const res = await this.api.delete_homework_from_student(
      this.selectedStudent.id,
      this.selectedHomework.id
    );
    if (res.success) {
      this.selectedStudent.student_homework =
        this.selectedStudent.student_homework.filter(
          (item: any) => item.id !== this.selectedHomework.id
        );
      this.selectedHomework = false;
      this.toastHandler('Homework deleted successfully', 'success');
    }
  }

  async submitGrades() {
    if (
      !this.selectedHomework ||
      !this.selectedStudent ||
      !this.selectedGroup
    ) {
      this.toastHandler('Недостаточно данных для оценки.', 'danger');
      return;
    }

    this.homework_graded_object.id = this.selectedHomework.id;
    this.homework_graded_object.graded = true;
    this.homework_graded_object.audio_url = this.audio_url;

    try {
      const res = await this.api.submit_homework_grades(
        this.homework_graded_object
      );

      if (res.success) {
        this.toastHandler('Grades submitted successfully', 'success');

        if (Array.isArray(this.selectedStudent.student_homework)) {
          this.selectedStudent.student_homework =
            this.selectedStudent.student_homework.filter(
              (item: any) => item.id !== this.selectedHomework?.id
            );
        }

        if (
          Array.isArray(this.selectedStudent.student_homework) &&
          this.selectedStudent.student_homework.length === 0
        ) {
          // Удаляем студента из группы
          if (Array.isArray(this.selectedGroup.user_table)) {
            this.selectedGroup.user_table =
              this.selectedGroup.user_table.filter(
                (student: any) => student.id !== this.selectedStudent?.id
              );
            this.student_selected = false;
          }
          if (
            Array.isArray(this.selectedGroup.students) &&
            this.selectedGroup.students.length === 0
          ) {
            if (Array.isArray(this.groups)) {
              this.groups = this.groups.filter(
                (group: any) => group.id !== this.selectedGroup?.id
              );
            }
          }
        }

        if (Array.isArray(this.selectedStudent.student_homework)) {
          this.selectedStudent.student_homework =
            this.selectedStudent.student_homework.filter(
              (hw: any) => hw.id !== this.selectedHomework?.id
            );
        }

        this.homework_graded_object = {
          id: 0,
          val_1: 0,
          val_2: 0,
          val_3: 0,
          val_4: 0,
          avg: 0,
          comment: '',
          audio_url: '',
          graded: true,
        };

        this.selectedHomework = null;

        this.fetchGroups(this.is_graded);
      } else {
        this.toastHandler(res.error || 'Ошибка при отправке оценок', 'danger');
      }
    } catch (error) {
      this.toastHandler('Ошибка при отправке оценок', 'danger');
      console.error(error);
    }
  }
}
