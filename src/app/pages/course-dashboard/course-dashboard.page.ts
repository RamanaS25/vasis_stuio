import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonChip, IonButtons, IonMenuButton, IonGrid, IonCol, IonRow, IonText, IonCardContent, IonCard, IonCardHeader, IonItem, IonIcon, IonButton, IonLabel, IonProgressBar, IonSegment, IonSegmentButton, IonCardTitle, IonList } from '@ionic/angular/standalone';
import { add,arrowBackOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
addIcons({add, arrowBackOutline});
@Component({
  selector: 'app-course-dashboard',
  templateUrl: './course-dashboard.page.html',
  styleUrls: ['./course-dashboard.page.scss'],
  standalone: true,
  imports: [IonList, IonCardTitle, IonSegmentButton, IonSegment, IonProgressBar, IonLabel, IonButton, IonIcon, IonItem, IonCardHeader, IonCard, IonCardContent, IonText, IonRow, IonCol, IonGrid, IonButtons, IonChip, IonContent, IonHeader, IonTitle, IonToolbar,IonMenuButton, CommonModule, FormsModule]
})
export class CourseDashboardPage implements OnInit {
  course_selected = false
  router = inject(Router)
 
  modules = [
    {
      title: 'Short Videos',
      components: [
        "Module 1", 'Module 2', 'Module 3'
      
      ],
      link:'/syllabus'
    },
    {
      title: 'Homework',
      components: ["Module 1", 'Module 2', 'Module 3']
    },
    {
      title: 'Notations',
      components: ["Module 1", 'Module 2', 'Module 3']
    }
  ]
  selectedModule:any = this.modules[0]
  constructor() { }

  ngOnInit() {
    console.log('course-dashboard')
  }

  navigateTo(x:string){
    console.log(x)
    this.router.navigate([x])
  }

}
