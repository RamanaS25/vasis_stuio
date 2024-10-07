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
    canActivate: [authGuard]
    
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
    path: 'student-sessions',
    loadComponent: () => import('./pages/student-sessions/student-sessions.page').then( m => m.StudentSessionsPage),
    canActivate: [authGuard]
  },
];

