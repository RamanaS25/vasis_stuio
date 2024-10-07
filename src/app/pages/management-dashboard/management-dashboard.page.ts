import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonText,
  IonGrid,
  IonCol,
  IonRow,
  IonMenuButton,
  IonButtons,
  IonChip,
  IonModal,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { LoginService } from 'src/app/services/auth/login.service';
@Component({
  selector: 'app-management-dashboard',
  templateUrl: './management-dashboard.page.html',
  styleUrls: ['./management-dashboard.page.scss'],
  standalone: true,
  imports: [
    IonModal,
    IonChip,
    IonButtons,
    IonRow,
    IonCol,
    IonGrid,
    IonText,
    IonCardContent,
    IonCard,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    IonMenuButton,
    FormsModule,
    ProfileComponent,
  ],
})
export class ManagementDashboardPage implements OnInit {
  auth = inject(LoginService);
  profile_open = false;

  sections = [
    {
      title: 'Student Management',
      link: '/studentm',
    },
    {
      title: 'Group Management',
      link: 'groupm',
    },
    {
      title: 'Payment Tracking',
      link: 'payment-tracking',
    },
    {
      title: 'Homework Grading',
      link: '/homework-grading',
    },

    {
      title: 'Homework Management',
      link: '/homework-management',
    },
    {
      title: 'Attendance',
      link: '/attendance',
    },
  ];
  constructor() {}
  router = inject(Router);
  ngOnInit() {
    console.log('management-dashboard');
  }

  navigateTo(link: string) {
    this.router.navigateByUrl(link);
  }

  open(x: any) {
    this.profile_open = false;
  }
}
