import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonChip, IonButtons, IonMenuButton, IonGrid, IonCol, IonRow, IonText, IonCardContent, IonCard, IonCardHeader, IonItem, IonIcon, IonButton, IonLabel, IonProgressBar, IonSegment, IonSegmentButton, IonCardTitle, IonList, IonModal, IonToast } from '@ionic/angular/standalone';
import { add,arrowBackOutline, link, lockClosed } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login.service';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { SessionsComponent } from "../../components/sessions/sessions.component";
import { HeaderComponent } from "../../components/header/header.component";
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipe } from '@ngx-translate/core';

addIcons({add, arrowBackOutline});
@Component({
  selector: 'app-course-dashboard',
  templateUrl: './course-dashboard.page.html',
  styleUrls: ['./course-dashboard.page.scss'],
  standalone: true,
  imports: [IonToast, TranslatePipe, IonModal, ProfileComponent, IonList, IonCardTitle, IonSegmentButton, IonSegment, IonProgressBar, IonLabel, IonButton, IonIcon, IonItem, IonCardHeader, IonCard, IonCardContent, IonText, IonRow, IonCol, IonGrid, IonButtons, IonChip, IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, CommonModule, FormsModule, SessionsComponent, HeaderComponent]
})
export class CourseDashboardPage implements OnInit {
  course_selected = false
  router = inject(Router)
  auth = inject(LoginService);
  profile_open = false
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
      components: ["Module 1", 'Module 2', 'Module 3'],
      link:'/homework-submission'
    },
    {
      title: 'Notations',
      components: ["Module 1", 'Module 2', 'Module 3'],
      link:'/notation'
    },

    {
      title: 'Recorded Classes',
      components: ["Sessions"],
      link:'/notation'
    }

  ]
  selectedModule:any = this.modules[0]

  toastBool = false
  message = ''
  color = 'primary'
  translate = inject(TranslateService);
  constructor() {
      addIcons({arrowBackOutline, lockClosed});
      this.translate.setDefaultLang('English');
      this.translate.use(this.auth.user_language);
    } 

  ngOnInit() {
    console.log('course-dashboard')
  }

 

  getNavigationParam(comp:string){
    
    switch (comp) {
       case 'Module 1':
        return 1
 

        case 'Module 2':
        return 2
  

        case 'Module 3':
        return 3
   
    
      default:
        break;
    }

    return 0

  }

 handleToast(message: string, color: string) {
    this.message = message;
    this.color = color;
    this.toastBool = true;
  }

  navigateTo(x:string, component:string){

    let grade = this.getNavigationParam(component)

    if(this.auth._user.is_admin || this.auth._user.grade >= grade){
      this.router.navigate([x], {queryParams:{grade: grade}})
      return
    }

    this.handleToast('You are not allowed to access this module', 'danger')
  }

}
