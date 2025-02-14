import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonSearchbar,
  IonInput,
  IonButton,
  IonSkeletonText,
  IonToast,
  IonCheckbox
} from '@ionic/angular/standalone';
import { StudentManagementService } from 'src/app/services/student/student-management.service';
import { LoginService } from 'src/app/services/auth/login.service';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-studentm',
  templateUrl: './studentm.page.html',
  styleUrls: ['./studentm.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonSearchbar,
    IonInput,
    IonButton,
    IonSkeletonText,
    IonToast,
    IonCheckbox,
    HeaderComponent,
  ],
})
export class StudentmPage {
  studentApi = inject(StudentManagementService);
  allUsers: any;
  allGroups: any;
  auth = inject(LoginService);

  user = {
    banned_payment: null,
    created_at: '',
    currency: null,
    email: '',
    grade: '',
    group_name: '',
    id: 269,
    initiated_name: ' ',
    is_admin: false,
    is_registered: false,
    language: '',
    legal_name: '',
    password: '!',
    phone: '',
    user_name: '',
    voice_scale: '',
  };

  onlyRegistered = true;
  selectedGroup: string = '';
  searchInput: string = '';
  showNoGroup = false;

  isToastOpen = false;
  message: string = '';

  constructor() {
    this.getAllStudents();
    this.getAllGrops();
  }

  async getAllStudents() {
    let x = await this.studentApi.getAllStudents();
    if (x.success) {
      this.allUsers = x.data;
    }
  }

  async getAllGrops() {
    let x = await this.studentApi.getAllGrops();
    if (x.success) {
      this.allGroups = x.data;
    }
  }

  selectUser(user: any) {
    this.user = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      grade: user.grade,
      voice_scale: user.voice_scale,
      language: user.language,
      group_name: user.group_name,
      is_registered: user.is_registered,
      legal_name: user.legal_name,
      initiated_name: user.initiated_name,
      is_admin: user.is_admin,
      banned_payment: user.banned_payment,
      password: user.password,
      user_name: user.user_name,
      created_at: user.created_at,
      currency: user.currency
    };
  }

  get filteredUsers() {
    let searchValue = this.searchInput.toLowerCase();

    let x = this.allUsers?.filter((user: any) => {
      return (
        user.legal_name?.toLowerCase().includes(searchValue) ||
        user.initiated_name?.toLowerCase().includes(searchValue)
      );
    });

    x = x?.filter(
      (user: { is_registered: boolean }) =>
        user?.is_registered === this.onlyRegistered
    );

    if (this.showNoGroup) {
      x = x?.filter((user: any) => user.group_name === '0');
    } else if (this.selectedGroup) {
      x = x?.filter((user: any) => user.group_name === this.selectedGroup);
    }

    return x;
  }

  async editUser(user: any) {
    let x = await this.studentApi.editUser(user);
    if (x.success) {
      this.message = 'User edited successfully';
      this.isToastOpen = true;
      this.getAllStudents();
    } else {
      console.log('error')
      console.log(x.error)
    }
  }

  async deleteUser(user: any) {
    let x = await this.studentApi.deleteUser(user.id);
    if (x.success) {
      this.message = 'User deleted successfully';
      this.isToastOpen = true;
      this.getAllStudents();
      this.user = {
        banned_payment: null,
        created_at: '',
        currency: null,
        email: '',
        grade: '',
        group_name: '',
        id: 269,
        initiated_name: ' ',
        is_admin: false,
        is_registered: false,
        language: '',
        legal_name: '',
        password: '!',
        phone: '',
        user_name: '',
        voice_scale: '',
      };
    }
  }
}
