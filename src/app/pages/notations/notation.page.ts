import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonBackButton, IonToolbar, IonButtons, IonMenuButton, IonRow, IonGrid, IonCol, IonItem } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { NotationsService } from 'src/app/services/notations/notations.service';
import { PdfComponent } from 'src/app/components/pdf/pdf/pdf.component';

@Component({
  selector: 'app-notation',
  templateUrl: './notation.page.html',
  styleUrls: ['./notation.page.scss'],
  standalone: true,
  imports: [IonItem, IonCol, IonGrid, IonRow, IonButtons,IonBackButton,  IonContent, IonHeader, PdfComponent, IonTitle, IonToolbar, IonMenuButton, CommonModule, FormsModule]
})
export class NotationPage implements OnInit {
  route = inject(ActivatedRoute)
  _notations = inject(NotationsService)
  grade = 0
  notations:any = []

  id = '1De6eNuOZgfe_7_aBn4G2UCAYu2QP-5h-'

  constructor() { }

  ngOnInit() {
    
    this.route.queryParams.subscribe(params => {
     this.grade = params['paramName']; // Retrieve the passed parameter
      console.log(this.grade);
      this.getNotations(this.grade)
    });
    console.log('afasef',this.grade)
   
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
