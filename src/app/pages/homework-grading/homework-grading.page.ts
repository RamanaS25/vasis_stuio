import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonRow, IonGrid, IonCard, IonCardHeader, IonButtons, IonBackButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-homework-grading',
  templateUrl: './homework-grading.page.html',
  styleUrls: ['./homework-grading.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons, IonCardHeader, IonCard, IonGrid, IonRow, IonCol, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomeworkGradingPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
