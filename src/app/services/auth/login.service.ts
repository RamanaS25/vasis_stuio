import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  api = inject(SupabaseService)
  supabase = this.api.getClient()
  private user:any
  private logged_in:boolean = false
  constructor() { }

  get _user() {
    return this.user;
  }
  get _logged_in() {
    return this.logged_in;
  }
  
  async login(user: any) {
    console.log(user.user_name, user.password)
     try {
       const { data, error } = await this.supabase
       .from('user_table')
       .select('user_name, legal_name, initiated_name, grade, id, email, phone, voice_scale , is_banned, language, is_registered, is_admin, student_payment_history(session_id), student_groups(name, zoom_link, student_sessions(*)) ')
       .eq('user_name', user.user_name).eq('password', user.password);

       console.log('data',data)
       if (error) {
         return {
           success: false,
           error: error.message // Supabase-specific error message
         };
       }

       if(!data.length) {
         return {
           success: false,
           error: 'Invalid Credentials'
         };
       } else {

          if(data[0].is_banned) {
            return {
              success: false,
              error: data[0].language === 'English' ? 'Please complete your payment to access this level' :
                     data[0].language === 'Portuguese' ? 'Por favor, complete o pagamento para acessar este nível' :
                     data[0].language === 'Spanish' ? 'Por favor, complete el pago para acceder a este nivel' :
                     'Please complete your payment to access this level'
            };
          }
          this.user = data[0]
          if(data[0].is_admin) {
            this.logged_in = true
            return {
              success: true,
              message: 'Logged in successfully'
            };
          }
        
          console.log( 'data', data[0])
          
          console.log('user',this.user.student_groups.student_sessions)
          this.user.payment_status = await this.check_if_paid(this.user.student_groups.student_sessions,this.user.student_payment_history)
          console.log('payment status', this.user.payment_status)  

          if(this.user.payment_status.some((x: { is_paid: string; }) => x.is_paid === 'warning')) {
            this.logged_in = true
            return {
              success: true,
            message: data[0].language === 'English' ? 'Please Complete your Payment for this level' :
                     data[0].language === 'Portuguese' ? 'Por favor, complete o pagamento para acessar este nível' :
                     data[0].language === 'Spanish' ? 'Por favor, complete el pago para acceder a este nivel' :
                     'Please complete your payment to access this level'
            };
          }else 
          if(this.user.payment_status.some((x: { is_paid: string; }) => x.is_paid === 'banned')) {
            return {
              success: false,
              error: data[0].language === 'English' ? 'Please complete your payment to access this level' :
                  data[0].language === 'Portuguese' ? 'Por favor, complete o pagamento para acessar este nível' :
                  data[0].language === 'Spanish' ? 'Por favor, complete el pago para acceder a este nivel' :
                  'Please complete your payment to access this level'
            };
          }

          this.logged_in = true
          return {
            success: true,
            message: 'Logged in successfully'
          };
       }

 
     } catch (err) {
       return {
         success: false,
         error: err instanceof Error ? err.message : 'An unexpected error occurred'
       };
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
  
  generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async register(user: any) {
    const { data, error } = await this.supabase.from('user_table').insert(user);
    if (error) {
      return {
        success: false,
        error: error.message // Supabase-specific error message
      };
    }

    return {
      success: true,
      data: data // Return the data if the query was successful
    };
  }

}
