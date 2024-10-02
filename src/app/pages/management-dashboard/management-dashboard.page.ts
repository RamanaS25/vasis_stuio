import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonText, IonGrid, IonCol, IonRow, IonMenuButton, IonButtons, IonChip } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-management-dashboard',
  templateUrl: './management-dashboard.page.html',
  styleUrls: ['./management-dashboard.page.scss'],
  standalone: true,
  imports: [IonChip, IonButtons, IonRow, IonCol, IonGrid, IonText, IonCardContent, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,IonMenuButton, FormsModule]
})
export class ManagementDashboardPage implements OnInit {
  sections = [
    {
      title: 'Student Management',
      link:'/studentm'
    },
    {
      title: 'Group Management',
      link:'groupm'
    },
    {
      title: 'Payment Tracking',
       link:'payment-tracking'
    }
    ,
    {
      title: 'Homework Grading',
      link: '/homework-grading'
    },
    
    {
      title: 'Homework Management',
      link: '/homework-management'
    },
    {
      title: 'Attendance',
      link: '/attendance'
    }
  ]
  constructor() { }
  router = inject(Router)
  ngOnInit() {
    console.log('management-dashboard')
  }

  navigateTo(link: string) {
    this.router.navigateByUrl(link);
  }

}
