import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { LoginService } from './services/auth/login.service';
import { TranslateService } from '@ngx-translate/core';

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
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonLabel,
    IonRouterLink,
    IonRouterOutlet,
  ],
})
export class AppComponent {

  auth = inject(LoginService);
  appPages = [
    { title: 'Home', title_es: 'Inicio', title_por: 'Inicio', url: '/home', icon: 'home',access:'public' },
    { title: 'Management', title_es: 'Gestion', title_por: 'Gestion', url: '/management-dashboard', icon: 'home',access:'admin' },
    { title: 'Payment Schedule', title_es: 'Programa de Pagos', title_por: 'Programa de Pagos', url: '/payment-schedule', icon: 'home',access:'student' },
    { title: 'Courses', title_es: 'Cursos', title_por: 'Cursos', url: '/course-dashboard', icon: 'home',access:'student' },
    { title: 'Tutorial', title_es: 'Tutorial', title_por: 'Tutorial', url: '/tutorial', icon: 'information-circle',access:'public' },
    { title: 'Contact', title_es: 'Contacto', title_por: 'Contacto', url: '/contact', icon: 'mail',access:'public' }

  ];
  translate = inject(TranslateService);
  constructor() {
    this.translate.setDefaultLang('English');
    
    this.translate.use(this.auth.user_language);
  }
}
