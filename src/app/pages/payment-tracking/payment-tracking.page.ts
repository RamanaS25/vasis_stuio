import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonMenuButton, IonHeader, IonTitle, IonToolbar, IonCol, IonRow, IonGrid, IonItem, IonSkeletonText, IonList, IonSelect, IonSelectOption, IonCardContent, IonCard, IonSearchbar, IonCardHeader, IonToggle, IonCardTitle, IonCardSubtitle, IonLabel, IonChip, IonCheckbox, IonBadge, IonButtons, IonText, IonToast, IonIcon } from '@ionic/angular/standalone';
import { PaymentTrackingService } from 'src/app/services/payment/payment-tracking.service';
import { add, arrowForwardOutline, ellipse } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { LoginService } from 'src/app/services/auth/login.service';
addIcons({ellipse,add, arrowForwardOutline})
@Component({
  selector: 'app-payment-tracking',
  templateUrl: './payment-tracking.page.html',
  styleUrls: ['./payment-tracking.page.scss'],
  standalone: true,
  imports: [IonIcon, IonToast, IonText, IonButtons,IonMenuButton, IonBadge, IonCheckbox, IonChip, IonLabel, IonCardSubtitle, IonCardTitle, IonToggle, IonCardHeader, IonSearchbar, IonCard, IonCardContent, IonList, IonSkeletonText, IonItem, IonGrid, IonRow, IonCol, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSelectOption, IonSelect]
})
export class PaymentTrackingPage implements OnInit {
  api = inject(PaymentTrackingService)
  user = inject(LoginService)
  students:any
  selectedGroup:string = 'All Groups'
  searchInput:string = ''

  selected_user:any
  student_group:any
  finished: boolean = false;

paymentDates: any = [
  {week_num: 1, date: ''},
  {week_num: 4, date: ''},
  {week_num: 8, date: ''},
  {week_num: 12, date: ''},
  {week_num: 16, date: ''},
  {week_num: 20, date: ''},
]

student_payment_history: any = [] 

message: string = '';
color: string = 'danger';
toastBool = false;

  
  constructor() { 
    this.getAllStudents()
  }

    async getAllStudents(): Promise<void> {
      console.log('get groups')
      let x = await this.api.getStudents();
      console.log(x)
      return new Promise((resolve) => {
        if(x.success) {
          console.log(x.data)
          this.students = x.data
          resolve()
        }
      })
    }

    isDateInThePast(dateString: string): boolean {
      const inputDate = new Date(dateString); // Convert the input string to a Date object
      const currentDate = new Date(); // Get the current date
    
      // Set both times to midnight to ignore time differences
      inputDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
    
      // Compare the input date with the current date
      return inputDate < currentDate;
    }

    processPaymentDates(paymentDates: any[], referenceData: any[], startDate: Date)  {  
      console.log(referenceData)
      const processedDates: any[] = [];
      let currentDate = new Date(startDate); // Start from the first supplied date
      
      // Loop through the paymentDates array
      paymentDates.forEach((payment, index) => {
        // Find the corresponding referenceData entry for the given week_num
        const matchedReference = referenceData.find((data) => 
          data.student_sessions.week_num === payment.week_num
        );
    
        // Determine if the entry exists in referenceData
        const isChecked = !!matchedReference;
    
        // Set the current date for this payment object
        payment.date = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        
        // Add checked property, id (if present), and update the paymentDates array
        processedDates.push({
          ...payment,
          checked: isChecked,
          id: isChecked ? matchedReference.id : null // Add the id from referenceData or null if not found
        });
        
        // Increment the date:
        // - By 3 weeks (21 days) for the first entry
        // - By 4 weeks (28 days) for all subsequent entries
        if (index === 0) {
          currentDate.setDate(currentDate.getDate() + 21); // First increment by 3 weeks
        } else {
          currentDate.setDate(currentDate.getDate() + 28); // Subsequent increments by 4 weeks
        }
      });
    
      console.warn('processedDates',processedDates);
      this.student_payment_history = processedDates;
    }
    

    addOneDay(dateString: string): string {
      const date = new Date(dateString); // Convert the input string to a Date object
      date.setDate(date.getDate() + 1); // Increment the date by 1 day
      return date.toDateString(); // Return the date in the default string format
    }
    
    

    get filteredUsers() {
      let filteredStudents = this.students;
    
      // Trim spaces from search input to handle extra spaces.
      const searchQuery = this.searchInput.trim().toLowerCase();
    
      // If no search input, filter by selected group
      if (searchQuery === '') {
        filteredStudents = this.selectedGroup === 'All Groups' 
          ? filteredStudents 
          : filteredStudents?.filter((group: any) => group.name === this.selectedGroup);
      } else {
        // If search input exists, filter the users by name (first name or legal name)
        filteredStudents = filteredStudents.map((group: any) => {
          const matchingUsers = group.user_table?.filter((user: any) => 
            (user.legal_name?.toLowerCase().includes(searchQuery) || 
             user.initiated_name?.toLowerCase().includes(searchQuery))
          );
    
          // Return only groups with matching users
          return { ...group, user_table: matchingUsers };
        })?.filter((group: any) => group.user_table.length > 0); // Filter out groups with no matching users
      }
    
      // Further filter by selected group if not "All Groups"
      if (this.selectedGroup !== 'All Groups') {
        filteredStudents = filteredStudents?.filter((group: any) => group.name === this.selectedGroup);
      }
    
      // Apply filtering for finished groups
      if (typeof this.finished === 'boolean') {
        filteredStudents = filteredStudents?.filter((group: any) => group.finished === this.finished);
      }
    
      return filteredStudents;
    }

    get _group() {
      let  x = this.students?.map((group: any) => group);
      if(this.finished){
        x = x.filter((item: any) => item.finished === this.finished)
      }
      return x;
    }

    handleToast(message: string, color: string) {
      this.message = message;
      this.color = color;
      this.toastBool = true;
    }

    handlecheckbox(event: any,session:any, uid:string) {
      if(event.detail.checked){
        this.addPayment(this.selected_user,session.week_num, uid)
      } else{
        this.deletePayment(session.id, uid)
      }
      console.log(event)
    }



    handleBannedToggle(event: any,student:any) {
      if(event.detail.checked){
        this.setStudentIsBanned(student.id, true)
      } else{
        this.setStudentIsBanned(student.id, false)
      }
      console.log(event)
    }

    async setStudentIsBanned(student_id:number, is_banned:boolean) {
      console.log(student_id, is_banned)
      const result = await this.api.setStudentIsBanned(student_id, is_banned);
      if (result.success) {
        // Use result.data
        this.getAllStudents()
        this.handleToast('Student banned successfully', 'success')
        
      } else {
        // Handle the error
        this.handleToast('Student not banned', 'danger')
        console.error(result.error);
      }
    }

   async addPayment(student: any, week_num: number, uid:string) {
      console.log(student, week_num)
      let group = this.getGroupForStudent(student)
      console.log(group, student, week_num)
      const result = await this.api.addPayment(student, week_num, group.name);
      if (result.success) {
        // Use result.data
        console.warn(result.data)

        await this.getandsetStudent(student.id)

        this.handleToast('Payment added successfully', 'success')
        
      } else {
        // Handle the error
        this.handleToast('Payment not added', 'danger')
        console.error(result.error);
      }
    }

    async check_if_paid(sessions: any, payment_history: any) {
      console.log(sessions, payment_history)
      const currentDate = new Date(); // Get the current date
      const payment_status: {
        week_num: any;
        session_date: any;
        is_paid: any;
      }[] = [];
    
      // Filter out all the sessions that represent payment dates (based on week numbers)
      const payment_dates = sessions.filter((session: any) =>
        session.week_num === 1 || (session.week_num % 4 === 0 && session.week_num <= 20)
      );
    
      // Loop through each payment date
      payment_dates.forEach((session: any) => {
        // Check if the session has been paid for
        const isPaid = payment_history.some((payment: any) => payment.session_id === session.id);
    
        // Add the payment status to the array
        payment_status.push({
          week_num: session.week_num,
          session_date: session.session_date, // Use 'session_date' instead of 'date'
          is_paid: isPaid ? "paid" : false
        });
      });
    
      // Find the last unpaid session
      const lastUnpaidSession = payment_status.find((status: any) => status.is_paid === false);
    
      if (lastUnpaidSession) {
        const lastUnpaidDate = new Date(lastUnpaidSession.session_date);
        const daysDifference = (currentDate.getTime() - lastUnpaidDate.getTime()) / (1000 * 60 * 60 * 24); // Difference in days
    
        // If the last unpaid session is less than or equal to 10 days in the past
        if (daysDifference >= 0 && daysDifference <= 10) {
          lastUnpaidSession.is_paid = "warning"; // Within 10 days
        } else if (daysDifference > 10) {
          lastUnpaidSession.is_paid = "banned"; // More than 10 days in the past
        }
      }
    
      return payment_status;
    }
    

    async getandsetStudent(uid:string) {
      let x = await this.api.getUser(uid)
      if(x){
        this.selected_user = {
          ...x,
          payment_status: this.api.check_if_paid(this.getGroupForStudent(x).student_sessions, x.student_payment_history),
          student_payment_history: x.student_payment_history
        };

     
        console.log(this.selected_user)
        this.processPaymentDates(this.paymentDates, x.student_payment_history, this.getGroupForStudent(x).start_date)

        this.students = this.students.map((group:any) => {
          if(group.user_table.find((student:any) => student.id === uid)){
            return { 
              ...group, 
              user_table: group.user_table.map((student:any) => 
                student.id === uid ? this.selected_user : student
              )
            }
          }
          return group
        })
        console.log('selected usewdqwdadwdadr',this.selected_user.payment_status)
        console.log('selected wwwww',this.students)
      }
    }



    async deletePayment(payment_history_id:number, uid:string) {
      console.log('delete payment')
      console.log(payment_history_id)
      const result = await this.api.deletePayment(payment_history_id);
      if (result.success) {
        // Use result.data
        await this.getandsetStudent(uid)
   
        this.handleToast('Payment deleted successfully', 'success')
        
      } else {
        // Handle the error
        this.handleToast('Payment not deleted', 'danger')
        console.error(result.error);
      }
    }

    getGroupForStudent(student: any): any | null {
      // Iterate over all groups
      for (let group of this.students) {
        // Check if the student is in the group's user_table
        const foundStudent = group.user_table.find((user: any) => 
          user.legal_name === student.legal_name || 
          user.email === student.email
        );
        
        // If a matching student is found, return the group without user_table
        if (foundStudent) {
          const { user_table, ...groupWithoutUserTable } = group;
           this.student_group = groupWithoutUserTable;
          return groupWithoutUserTable;
        }
      }
      
      // Return null if no group is found for the student
      return null;
    }
    
    
    

  ngOnInit() {
     console.log('hello payment tracking')
  }

}
