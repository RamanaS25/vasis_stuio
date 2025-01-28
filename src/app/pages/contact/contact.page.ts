import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSegmentButton, IonLabel, IonCard, IonCardHeader, IonCardSubtitle, IonMenuButton, IonCardTitle, IonCardContent, IonList, IonItem, IonIcon, IonNote, IonSegment, IonButton, IonButtons } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, mail, phonePortraitOutline, phonePortrait, logoWhatsapp } from 'ionicons/icons';
addIcons({ mailOutline, mail, phonePortraitOutline, phonePortrait, logoWhatsapp });
@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  standalone: true,
  imports: [IonButtons, IonButton, 
    IonNote, 
    IonIcon, 
    IonItem, 
    IonList, 
    IonCardContent, 
    IonCardTitle, 
    IonCardSubtitle, 
    IonCardHeader, 
    IonCard, 
    IonLabel, 
    IonSegmentButton, 
    IonSegment,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule,
    IonMenuButton
  ]
})
export class ContactPage implements OnInit {
  selectedLanguage = 'en';

  constructor() {
      addIcons({logoWhatsapp,mail}); }

  ngOnInit() {
  }

}
