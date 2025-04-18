import { Component, inject, Input, input, OnInit, output } from '@angular/core';
import {
  IonCard,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
  IonIcon,
  IonAvatar,
  IonContent,
} from '@ionic/angular/standalone';
import { LoginService } from 'src/app/services/auth/login.service';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  personCircleOutline,
  mailOutline,
  callOutline,
  peopleOutline,
  schoolOutline,
  musicalNotesOutline,
  logOutOutline,
} from 'ionicons/icons';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonAvatar,
    IonIcon,
    IonButton,
    IonLabel,
    IonItem,
    IonCard,
    IonList,
  ],
})
export class ProfileComponent implements OnInit {
  auth = inject(LoginService);
  @Input() profile_open = false;
  profileOutput = output<boolean>();
  constructor() {
    addIcons({
      closeOutline,
      personCircleOutline,
      mailOutline,
      callOutline,
      peopleOutline,
      schoolOutline,
      musicalNotesOutline,
      logOutOutline,
    });
  }

  closeModal(x: boolean) {
    this.profileOutput.emit(x);
  }

  logout() {
    this.auth.logout();
  }

  ngOnInit() {}
}
