import { Component, Input, input, OnInit, output } from '@angular/core';
import {
  IonCard,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [IonButtons, IonButton, IonLabel, IonItem, IonCard, IonList],
})
export class ProfileComponent implements OnInit {
  @Input() profile_open = false;
  profileOutput = output<boolean>();
  constructor() {}

  closeModal(x: boolean) {
    this.profileOutput.emit(x);
  }

  ngOnInit() {}
}
