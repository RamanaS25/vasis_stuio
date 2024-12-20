import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonIcon, IonItem, IonLabel, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { AttendenceService } from './attendence.service';
import { checkmarkOutline, closeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

interface Session {
  id: number;
  week_num: number;
  attendance: any[];
}

interface Student {
  id: number;
  name: string;
  attendance: number[];
}

interface Group {
  name: string;
  weeks: number;
  course_id: number;
  students: Student[];
  sessions: { [key: string]: Session };
}

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar,
    IonSelect,
    IonSelectOption,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonIcon,
    IonItem,
    IonLabel,
    CommonModule, 
    FormsModule
  ]
})
export class AttendancePage implements OnInit {
  private attendanceService = inject(AttendenceService);
  
  groups: { [key: string]: Group } = {};
  selectedGroup: string = '';
  sessionNumbers: number[] = [];

  constructor() {
    addIcons({ checkmarkOutline, closeOutline });
    this.loadAttendanceData();
  }

  async loadAttendanceData() {
    const data = await this.attendanceService.getAttendance(1);
    this.groups = data;
    this.selectedGroup = Object.keys(this.groups)[0];
    this.updateSessionNumbers();
  }

  updateSessionNumbers() {
    if (this.selectedGroup && this.groups[this.selectedGroup]) {
      this.sessionNumbers = Object.values(this.groups[this.selectedGroup].sessions)
        .map(session => session.week_num)
        .sort((a, b) => a - b);
    }
  }

  onGroupChange(event: any) {
    this.selectedGroup = event.detail.value;
    this.updateSessionNumbers();
  }

  isStudentPresent(studentId: number, sessionNum: number): boolean {
    const session = this.groups[this.selectedGroup].sessions[sessionNum];
    let is_present: boolean = session.attendance.some(record => record.student_id === studentId);
    if(studentId === 1261 && sessionNum === 1) {
      console.log(JSON.stringify({session, studentId, sessionNum, is_present}, null, 2))
    }
   
    return is_present
  }

  getAttendancePercentage(student: Student): number {
    if (!this.sessionNumbers.length) return 0;
    
    const attendedSessions = this.sessionNumbers.filter(sessionNum => 
      this.isStudentPresent(student.id, sessionNum)
    ).length;
    
    return Math.round((attendedSessions / this.sessionNumbers.length) * 100);
  }

  async setAttendance(sessionNum: number, student_id: number) {
    console.log(this.groups[this.selectedGroup])
    const session = this.groups[this.selectedGroup].sessions[sessionNum];
    let res = await this.attendanceService.setAttendance(session.id, student_id);
    console.log(JSON.stringify({res}, null, 2))
    if(res.success) {
      // Optimistically update the local data structure
      this.groups[this.selectedGroup].sessions[sessionNum].attendance.push({
        student_id: student_id,
        session_id: session.id
      });
      this.updateSessionNumbers();
    }
    console.log(this.groups[this.selectedGroup])
  }

  async removeAttendance(sessionNum: number, student_id: number) {
    console.log(this.groups[this.selectedGroup])
    const session = this.groups[this.selectedGroup].sessions[sessionNum];

    let res = await this.attendanceService.removeAttendance(session.id, student_id);
    if(res.success) {
      this.groups[this.selectedGroup].sessions[sessionNum].attendance = this.groups[this.selectedGroup].sessions[sessionNum].attendance.filter(record => record.student_id !== student_id);
      this.updateSessionNumbers();
    }
  }



  ngOnInit() {}
}
