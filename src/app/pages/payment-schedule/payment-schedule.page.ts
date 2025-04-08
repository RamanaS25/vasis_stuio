import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCol, IonRow, IonGrid } from '@ionic/angular/standalone';
import { HeaderComponent } from "../../components/header/header.component";
import { CrudService } from '../../services/crud';
import { LoginService } from '../../services/auth/login.service';
import { TeacherViewComponent } from "./components/teacher-view/teacher-view.component";
import { PaymentSessionsComponent } from "./components/payment-sessions/payment-sessions.component";
@Component({
  selector: 'app-payment-schedule',
  templateUrl: './payment-schedule.page.html',
  styleUrls: ['./payment-schedule.page.scss'],
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonContent, CommonModule, FormsModule, HeaderComponent, TeacherViewComponent, PaymentSessionsComponent]
})
export class PaymentSchedulePage implements OnInit {
  api = inject(CrudService);
  auth = inject(LoginService);
  groups: any[] = [];
  group_name: string = '';
  selectedGroup = signal<any>(null);
  constructor() { 
    if (this.auth._user?.is_admin) {
      this.getPaymentScheduleAdmin();
    }
  }

  ngOnInit() {
  }



  async getPaymentScheduleAdmin() {
    const response = await this.api.getMany('student_groups', {
      filters: [{
        column: 'status',
        value: true
      }]
    });
    if (response.data) {
      this.groups = response.data;
    }
  }

}
