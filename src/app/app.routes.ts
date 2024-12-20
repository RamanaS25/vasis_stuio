import { Routes } from '@angular/router';
import { CanActivate, Router } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'syllabus',
    loadComponent: () => import('./pages/syllabus/syllabus.page').then( m => m.SyllabusPage),
    canActivate: [authGuard]
  },
  {
    path: 'tutorial',
    loadComponent: () => import('./pages/tutorial/tutorial.page').then( m => m.TutorialPage),
  },
  {
    path: 'studentm',
    loadComponent: () => import('./pages/studentm/studentm.page').then( m => m.StudentmPage) ,
    canActivate: [authGuard]
  },
  {
    path: 'groupm',
    loadComponent: () => import('./pages/groupm/groupm.page').then( m => m.GroupmPage) ,    
    canActivate: [authGuard]
  },
  {
    path: 'payment-tracking',
    loadComponent: () => import('./pages/payment-tracking/payment-tracking.page').then( m => m.PaymentTrackingPage),
    canActivate: [authGuard]
  },
  {
    path: 'course-dashboard',
    loadComponent: () => import('./pages/course-dashboard/course-dashboard.page').then( m => m.CourseDashboardPage),
    canActivate: [authGuard]
  },
  {
    path: 'management-dashboard',
    loadComponent: () => import('./pages/management-dashboard/management-dashboard.page').then( m => m.ManagementDashboardPage),
    canActivate: [authGuard]
  },
  {
    path: 'homeworkm',
    loadComponent: () => import('./pages/homeworkm/homeworkm.page').then( m => m.HomeworkmPage),
    canActivate: [authGuard]
  },
  {
    path: 'homework-submission',
    loadComponent: () => import('./pages/homework-submission/homework-submission.page').then( m => m.HomeworkSubmissionPage),
    canActivate: [authGuard]
  },
  {
    path: 'notation',
    loadComponent: () => import('./pages/notations/notations.page').then( m => m.NotationsPage),
    canActivate: [authGuard]
  },
  {
    path: 'homework-grading',
    loadComponent: () => import('./pages/homework-grading/homework-grading.page').then( m => m.HomeworkGradingPage),
    canActivate: [authGuard]
  },
  {
    path: 'attendance',
    loadComponent: () => import('./pages/attendance/attendance.page').then( m => m.AttendancePage),
    canActivate: [authGuard]
  },



];

