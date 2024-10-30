import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonBackButton, IonToolbar, IonButtons, IonMenuButton, IonRow, IonGrid, IonCol, IonItem, IonIcon, IonModal, IonInput, IonCardContent, IonCard, IonTabButton, IonButton, IonLabel } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { NotationsService } from 'src/app/services/notations/notations.service';
import { addIcons } from 'ionicons';
import { linkOutline } from 'ionicons/icons';
import { SafeUrlPipe } from "../../pipes/safe/safe-url.pipe";
import { LoginService } from 'src/app/services/auth/login.service';
addIcons({linkOutline});
@Component({
  selector: 'app-notation',
  templateUrl: './notation.page.html',
  styleUrls: ['./notation.page.scss'],
  standalone: true,
  imports: [IonLabel, IonButton, IonTabButton, IonCard, IonCardContent, IonInput, IonModal, IonIcon, IonItem, IonCol, IonGrid, IonRow, IonButtons, IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, CommonModule, FormsModule, SafeUrlPipe]
})
export class NotationPage implements OnInit {
  auth = inject(LoginService)
  route = inject(ActivatedRoute)
  _notations = inject(NotationsService)
  grade = 0
  notations:any = []
  modalBool = false
  editBool = false 
  id = '1ru2mcA9TCg_ueIAbHzTYE7lnvL268Uvs'
  type = 'edit'
  selectedClass:any
  constructor() { }

  isMobile() {
    return window.matchMedia('(max-width: 767px)').matches;
  }

  ngOnInit() {
    
    this.route.queryParams.subscribe(params => {
     this.grade = params['paramName']; // Retrieve the passed parameter
      console.log(this.grade);
      this.getNotations(this.grade)
    });
    console.log('afasef',this.grade)
   
  }

  linkToPdf(link: string): void {
    const url = 'https://drive.google.com/file/d/' + link + '/preview';
    window.open(url, '_blank');
  }
  

  async getNotations(grade:number){
    const result = await this._notations.getNotations(grade);

    if (result.success) {
      // Use result.data
      this.notations = result.data;
      
    } else {
      // Handle the error
      console.error(result.error);
    }
  }

}
