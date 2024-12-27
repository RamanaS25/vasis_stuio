import { Component, inject, Input, input, OnInit, output } from '@angular/core';
import {
  IonCard,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons, IonIcon } from '@ionic/angular/standalone';
import { LoginService } from 'src/app/services/auth/login.service';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [IonIcon,IonButton, IonLabel, IonItem, IonCard, IonList],
})
export class ProfileComponent implements OnInit {
  auth = inject(LoginService)
  @Input() profile_open = false;
  profileOutput = output<boolean>();
  constructor() {
    addIcons({closeOutline});
  }

  closeModal(x: boolean) {
    this.profileOutput.emit(x);
  }

  ngOnInit() {}
}
