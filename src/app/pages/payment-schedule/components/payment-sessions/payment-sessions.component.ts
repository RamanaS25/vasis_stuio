import { Component, computed, inject, input, OnInit, signal, SimpleChanges } from '@angular/core';
import { IonCard, IonLabel, IonItem, IonChip } from '@ionic/angular/standalone';
import { CrudService } from 'src/app/services/crud';
import {  DatePipe } from '@angular/common';
import { LoginService } from 'src/app/services/auth/login.service';

@Component({
  selector: 'app-payment-sessions',
  templateUrl: './payment-sessions.component.html',
  styleUrls: ['./payment-sessions.component.scss'],
  standalone: true,
  imports: [IonChip,  IonCard, IonLabel, IonItem, DatePipe]
})
export class PaymentSessionsComponent  implements OnInit {
  auth = inject(LoginService);
  group = input<any>(null);
  api = inject(CrudService);
  private _paymentSessions = signal<any[]>([]);
  paymentSessions = computed(() => 
    this._paymentSessions()
      .filter((session) => (session.week_num % 4 === 0 || session.week_num === 1) && session.week_num !== 24)
      .sort((a, b) => a.week_num - b.week_num)
  );

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['group'] && this.group()) {
      console.log('Group changed:', this.group());
      if (this.auth._user?.is_admin) {
        this.getPaymentSchedule();
      }
      else {
        this.getPaymentStudent();
      }
    }
  }

  async getPaymentSchedule() {

    if (!this.group()) return;
    
    const response = await this.api.getMany('student_sessions', {
      filters: [
        {
          column: 'group_name',
          value: this.group().name
        }
      ] 
    });
    console.log(response)

    if (response.data) {
      this._paymentSessions.set(response.data);
    }
  }

  async getPaymentStudent() {
    console.log(this.auth._user?.student_groups.name);
    const response = await this.api.getMany('student_sessions', {

      filters: [
      {
        column: 'group_name',
        value: this.auth._user?.student_groups.name
      },
      {
        column: 'paid.student_id',
        value: this.auth._user?.id
      }
    ],
      properties: ['id', 'group_name', 'week_num', 'session_date', 'paid:student_payment_history(id, student_id)'],
      
    });
    console.log(response);
    if (response.data) {
      response.data.forEach((session: any) => {
        session.paid = session.paid.length > 0 ? true : false;
      });
      this._paymentSessions.set(response.data);
    }
  }
  
  // Helper methods for template
  isPastSession(session: any): boolean {
    const now = new Date();
    const sessionDate = new Date(session.session_date);
    return sessionDate < now;
  }
  
  isFutureSession(session: any): boolean {
    return !this.isPastSession(session);
  }
}
