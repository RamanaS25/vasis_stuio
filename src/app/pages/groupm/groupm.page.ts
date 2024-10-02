import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,IonMenuButton, IonCol, IonRow, IonGrid, IonCard, IonText, IonCardContent } from '@ionic/angular/standalone';
import { GroupManagementService } from 'src/app/services/group/group-management.service';


@Component({
  selector: 'app-groupm',
  templateUrl: './groupm.page.html',
  styleUrls: ['./groupm.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonText, IonCard, IonGrid, IonRow, IonCol, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, IonMenuButton, FormsModule]
})
export class GroupmPage implements OnInit {
  api = inject(GroupManagementService);
  constructor() { 
     this.getGroups()
    
  }
  
  ngOnInit() {
    console.log('groupm')
  }

 async getGroups() {
  console.log('get groups')
   let x = await this.api.getGroups();
   if(x.success) {
     console.log(x.data)
    
   }
  }

  insertSessionsIntoGroup(group:any) {
    console.log(group)
    this.api.insertGroupSessions(group);
  }

  



}
