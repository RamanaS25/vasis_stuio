import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { StudentManagementService } from 'src/app/services/student/student-management.service';

@Component({
  selector: 'app-studentm',
  templateUrl: './studentm.page.html',
  styleUrls: ['./studentm.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class StudentmPage implements OnInit {
 studentApi = inject(StudentManagementService)
  constructor() { }

  ngOnInit() {
    console.log('studentm')
  }
 
  async getAllStudents() {
   let x = await this.studentApi.getAllStudents()
   
   if(x.success){
    console.log(x.data)
   }

   console.log(x)
  }
}
