import { Routes } from '@angular/router';

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
    loadComponent: () => import('./pages/syllabus/syllabus.page').then( m => m.SyllabusPage)
  },
  {
    path: 'tutorial',
    loadComponent: () => import('./pages/tutorial/tutorial.page').then( m => m.TutorialPage)
  },
  {
    path: 'studentm',
    loadComponent: () => import('./pages/studentm/studentm.page').then( m => m.StudentmPage)
  },
  {
    path: 'groupm',
    loadComponent: () => import('./pages/groupm/groupm.page').then( m => m.GroupmPage)
  },
  {
    path: 'payment-tracking',
    loadComponent: () => import('./pages/payment-tracking/payment-tracking.page').then( m => m.PaymentTrackingPage)
  },
  {
    path: 'course-dashboard',
    loadComponent: () => import('./pages/course-dashboard/course-dashboard.page').then( m => m.CourseDashboardPage)
  },
  {
    path: 'management-dashboard',
    loadComponent: () => import('./pages/management-dashboard/management-dashboard.page').then( m => m.ManagementDashboardPage)
  },  {
    path: 'homeworkm',
    loadComponent: () => import('./pages/homeworkm/homeworkm.page').then( m => m.HomeworkmPage)
  },

];
