import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { LoginService } from './services/auth/login.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    IonRouterOutlet,
  ],
})
export class AppComponent {

  auth = inject(LoginService);
  appPages = [
    { title: 'Home', url: '/home', icon: 'home',access:'public' },
    { title: 'Management', url: '/management-dashboard', icon: 'home',access:'admin' },
    { title: 'Courses', url: '/course-dashboard', icon: 'home',access:'student' },
    { title: 'Tutorial', url: '/tutorial', icon: 'information-circle',access:'public' },
    { title: 'Contact', url: '/contact', icon: 'mail',access:'public' }

  ];
  constructor() {}
}
