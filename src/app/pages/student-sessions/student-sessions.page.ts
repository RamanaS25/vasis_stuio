import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-student-sessions',
  templateUrl: './student-sessions.page.html',
  styleUrls: ['./student-sessions.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class StudentSessionsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
