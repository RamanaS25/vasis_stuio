import { Component, Input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonModal,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonAccordion,
  IonSegment,
  IonSegmentButton,
  IonAccordionGroup,
  IonFab,
  IonFabButton,
  IonFabList,
  IonSearchbar,
  IonProgressBar,
  IonPopover,
  IonSkeletonText,
  IonCard,
  IonToast,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonModal,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonChip,
    IonGrid,
    IonRow,
    IonCol,
    IonAccordion,
    IonSegment,
    IonSegmentButton,
    IonAccordionGroup,
    IonFab,
    IonFabButton,
    IonFabList,
    IonSearchbar,
    IonProgressBar,
    IonPopover,
    IonSkeletonText,
    IonCard,
    IonToast,
    CommonModule,
    FormsModule,
  ],
})
export class LoginComponent implements OnInit {
  open_toast: boolean = false;
  message: string = '';

  isloading = false;

  @Input() login_open = false;
  signup_open = false;
  user = {
    username: 'Ramana',
    intiated_name: 'Ramana',
    password: 'Point123',
    _password: 'Point123',
    email: 'ramana@gmail.com',
    phone: '+91 9876543210',
    lang_type: 'English',
  };

  loginOutput = output<boolean>();
  constructor() {}

  closeModal(x: boolean) {
    this.loginOutput.emit(x);
  }
  login() {}
  signUp() {
    if (this.user.password !== this.user._password) {
      this.open_toast = true;
      this.message = 'Passwords do not match';
      return;
    }
    const atSymbolIndex = this.user.email.indexOf('@');
    const dotIndex = this.user.email.lastIndexOf('.');
    let check =
      atSymbolIndex > 0 &&
      dotIndex > atSymbolIndex + 1 &&
      dotIndex < this.user.email.length - 1;
    if (!check) {
      this.open_toast = true;
      this.message = 'Invalid Email';
      return;
    }
    const userValue = Object.values(this.user);
    userValue.forEach((value, index) => {
      if (value === '') {
        this.open_toast = true;
        this.message = 'Please fill all the fields';
        return;
      }
    });
  }

  ngOnInit() {}
}
