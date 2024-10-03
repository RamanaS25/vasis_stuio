import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonSearchbar,
  IonLabel,
  IonInput,
  IonButton,
  IonToggle,
  IonSkeletonText,
  IonToast,
} from '@ionic/angular/standalone';
import { StudentManagementService } from 'src/app/services/student/student-management.service';

@Component({
  selector: 'app-studentm',
  templateUrl: './studentm.page.html',
  styleUrls: ['./studentm.page.scss'],
  standalone: true,
  imports: [
    IonToast,
    IonSkeletonText,
    IonToggle,
    IonButton,
    IonInput,
    IonLabel,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonList,
    IonCard,
    IonCol,
    IonRow,
    IonGrid,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonMenuButton,
  ],
})
export class StudentmPage implements OnInit {
  studentApi = inject(StudentManagementService);
  allUsers: any;
  allGroups: any;

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
  onlyRegistered = false;
  selectedGroup: string = '';
  searchInput: string = '';

  isToastOpen = false;
  message: string = '';

  constructor() {
    this.getAllStudents();
    this.getAllGrops();
  }

  ngOnInit() {
    console.log('studentm');
  }

  async getAllStudents() {
    let x = await this.studentApi.getAllStudents();

    if (x.success) {
      console.log(x.data);
      this.allUsers = x.data;
    }

    console.log(x);
  }

  async getAllGrops() {
    let x = await this.studentApi.getAllGrops();

    if (x.success) {
      console.log(x.data);
      this.allGroups = x.data;
    }

    console.log(x);
  }

  get filteredUsers() {
    let searchValue = this.searchInput.toLowerCase();

    let x = this.allUsers?.filter((user: any) => {
      return (
        user.legal_name.toLowerCase().includes(searchValue) ||
        user.initiated_name?.toLowerCase().includes(searchValue) // Check for initiated_name
      );
    });

    if (this.onlyRegistered) {
      x = x.filter((user: { is_registered: boolean }) => user.is_registered);
    }

    // If no group is selected, return the filtered users without group filtering
    if (this.selectedGroup === '') {
      return x;
    }

    // Further filter the users based on the selected group
    return x.filter(
      (user: { group_name: string }) => user.group_name === this.selectedGroup
    );
  }

  async editUser(user: any) {
    let x = await this.studentApi.editUser(
      user.id,
      user.email,
      user.phone,
      user.grade,
      user.voice_scale,
      user.language,
      user.group_name,
      user.is_registered
    );
    if (x.success) {
      this.toast('User updated successfully');
    }
  }
  async deleteUser(user: any) {
    let x = await this.studentApi.deleteUser(user.id);
    if (x.success) {
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
      this.toast('User deleted successfully');
    }
  }

  toast(message: string) {
    this.isToastOpen = true;
    this.message = message;
  }
}
