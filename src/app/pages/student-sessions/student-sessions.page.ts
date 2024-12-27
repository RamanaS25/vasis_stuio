import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonMenuButton, IonHeader, IonTitle, IonToolbar, IonGrid, IonCol, IonRow, IonCard, IonText, IonChip, IonIcon, IonItem, IonLabel, IonModal, IonToast, IonCardContent, IonButtons, IonCardHeader } from '@ionic/angular/standalone';
import { YoutubePlayerComponent } from 'src/app/components/youtube-player/youtube-player.component';
import { SessionsService } from 'src/app/services/student-sessions/sessions.service';
import { LoginService } from 'src/app/services/auth/login.service';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { addIcons } from 'ionicons';
import { play, link, playOutline, close } from 'ionicons/icons';
import { HeaderComponent } from "../../components/header/header.component";
addIcons({play,link});
@Component({
  selector: 'app-student-sessions',
  templateUrl: './student-sessions.page.html',
  styleUrls: ['./student-sessions.page.scss'],
  standalone: true,
  imports: [IonCardHeader, IonButtons, ProfileComponent, IonCardContent, IonToast, IonMenuButton, IonModal, YoutubePlayerComponent, IonLabel, IonItem, IonIcon, IonChip, IonText, IonCard, IonRow, IonCol, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, HeaderComponent]
})
export class StudentSessionsPage implements OnInit {
auth = inject(LoginService)
sessionsService = inject(SessionsService)
 student_sessions:any[] = []
 watchVideo:boolean = false
 selectedSession:any = null
 showToast:boolean = false
 message:string = ''
 color:string = ''

 user_profile: boolean = false;
  constructor() { 
    this.getSessions()
  }

  ngOnInit() {
  }

  handleToast(message:string, color:string){
    this.message = message
    this.color = color
    this.showToast = true
  }

  openLink(link:string){
    window.open(link, '_blank');
  }

  sortSessions(data: any) {
     if(!data) return data
        data.sort((a: any, b: any) => a.week_num - b.week_num);
  
    return data;
  }

  async getSessions(){
    
    this.student_sessions = this.sortSessions(this.auth._user.student_groups.student_sessions)


  }


  checkDateStatus(dateString: string): string {
    // Convert the input date to a Date object
    const inputDate = new Date(dateString);
    const today = new Date();
    
    // Remove time part of today's date for accurate comparison
    today.setHours(0, 0, 0, 0);
  
    // Calculate the difference in days between the input date and today
    const differenceInTime = inputDate.getTime() - today.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  
    if (differenceInDays < 0) {
      // The date is in the past
      return "past";
    } else if (differenceInDays <= 7) {
      // The date is within the next 10 days
      return "next";
    } else {
      // The date is more than 10 days in the future
      return "future";
    }
  }

}
