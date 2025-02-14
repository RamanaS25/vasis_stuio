import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';

@Injectable({
  providedIn: 'root'
})

export class PaymentTrackingService {
  
  api = inject(SupabaseService)
  supabase = this.api.getClient()
  constructor() { }


  check_if_paid(sessions: any, payment_history: any) {
    const currentDate = new Date();
    
    // Get all payment dates (week 1 and multiples of 4 up to 20)
    const paymentDates = sessions
        .filter((session: any) => 
            session.week_num === 1 || (session.week_num % 4 === 0 && session.week_num <= 20)
        )
        .sort((a: any, b: any) => 
            new Date(b.session_date).getTime() - new Date(a.session_date).getTime()
        );

    // Find the most recent payment date that has already passed
    const latestDueDate = paymentDates.find((session: any) => 
        new Date(session.session_date) <= currentDate
    );

    // If no payment dates have passed yet, they're paid up
    if (!latestDueDate) return "paid";

    // Check if there's a payment for this specific session date
    const hasPayment = payment_history.some((payment: any) => 
        payment.student_sessions.week_num === latestDueDate.week_num
    );

    if (hasPayment) return "paid";

    // Calculate days since payment was due
    const daysSince = (currentDate.getTime() - new Date(latestDueDate.session_date).getTime()) 
        / (1000 * 60 * 60 * 24);

    if (daysSince <= 10) return "warning";
    return "banned";
}
  
  async getStudents() {
    try {
      const { data, error } = await this.supabase
        .from('student_groups')
        .select('name, start_date, end_date, is_active, student_sessions!inner(*), user_table( id, is_banned, legal_name, is_registered, initiated_name, email, phone, is_admin, student_payment_history( id, student_sessions(session_date, week_num)))')
        .eq('user_table.is_registered', true)
        .eq('user_table.is_banned', false)
        .eq('user_table.is_admin', false)
        .eq('is_active', true)

      if (error) {
        return {
          success: false,
          error: error.message // Supabase-specific error message
        };
      }

      console.log(data)
  
      // Add the 'finished' property based on the 'end_date'
      const currentDate = new Date();
      const processedData = data.map((group: any) => ({
        ...group,
        finished: new Date(group.end_date) < currentDate, // Set 'finished' based on 'end_date'
        user_table: group.user_table.map((user: any) => ({
          ...user,
          payment_status: this.check_if_paid(group.student_sessions, user.student_payment_history),
          student_payment_history: user.student_payment_history
      }))
      }));

      console.warn(JSON.stringify(processedData[0].student_sessions, null, 2))
      console.warn(JSON.stringify(processedData[0].user_table[0], null, 2))
      return {
        success: true,
        data: processedData // Return processed data with 'finished' property
      };
  
    } catch (err) {
      // Type-safe handling of the 'unknown' error type
      let errorMessage = 'An unexpected error occurred';
  
      if (err instanceof Error) {
        errorMessage = err.message; // Safely access the error message
      }
  
      return {
        success: false,
        error: errorMessage // Return the formatted error message
      };
    }
  }

  async addPayment(student: any, week_num: number, group_name: string) {
    console.log( week_num, group_name)
    try {
      // 1. Retrieve session_id from student_sessions based on week_num and group_name
      const { data: sessionData, error: sessionError } = await this.supabase
        .from('student_sessions')
        .select('id')
        .eq('week_num', week_num)
        .eq('group_name', group_name)
        .single(); // Assuming there's only one session for the given week_num and group_name
  
        console.log('hi',sessionData)
      // Check for errors in fetching the session
      if (sessionError) {
        return {
          success: false,
          error: sessionError.message
        };
      }
  
      if (!sessionData) {
        return {
          success: false,
          error: "Session not found"
        };

    
      }
  
      // 2. Prepare the data to be inserted
      const paymentData = {
        session_id: sessionData.id,
        student_id: student.id
      };

      console.log(paymentData , sessionData, student)
  
      // 3. Insert the payment into student_sessions
      const { data: insertData, error: insertError } = await this.supabase
        .from('student_payment_history')
        .insert(paymentData)
        .select();
      // Check for errors in the insert operation
      if (insertError) {
        return {
          success: false,
          error: insertError.message
        };
      }
  
      // 4. Return success with inserted data
      return {
        success: true,
        data: insertData // Return the inserted data
      };
  
    } catch (err) {
      // 5. Catch and handle unexpected errors
      let errorMessage = 'An unexpected error occurred';
  
      if (err instanceof Error) {
        errorMessage = err.message; // Access the error message
      }
  
      return {
        success: false,
        error: errorMessage // Return the formatted error message
      };
    }
  }

 async deletePayment(payment_history_id:number) {
  console.log(payment_history_id)
    try {
      // 1. Retrieve session_id from student_sessions based on week_num and group_name
      const { data: sessionData, error: sessionError } = await this.supabase
        .from('student_payment_history')
        .delete()
        .eq('id', payment_history_id);
        

        if (sessionError) {
          return {
            success: false,
            error: "Session not found"
          };
        }
  
        return {
          success: true,
          data: sessionData
        }
  
    } catch (err) {
      // 5. Catch and handle unexpected errors
      let errorMessage = 'An unexpected error occurred';
  
      if (err instanceof Error) {
        errorMessage = err.message; // Access the error message
      }
  
      return {
        success: false,
        error: errorMessage // Return the formatted error message
      };
    }
  }

  async setStudentIsBanned(student_id:number, is_banned:boolean) {
    try {
      console.log(student_id, is_banned)
      // 1. Retrieve session_id from student_sessions based on week_num and group_name
      const { data: sessionData, error: sessionError } = await this.supabase
        .from('user_table')
        .update({ is_banned })
        .eq('id', student_id);
        

        if (sessionError) {
          return {
            success: false,
            error: "Session not found"
          };
        }
  
        return {
          success: true,
          data: sessionData
        }
  
    } catch (err) {
      // 5. Catch and handle unexpected errors
      let errorMessage = 'An unexpected error occurred';
  
      if (err instanceof Error) {
        errorMessage = err.message; // Access the error message
      }
  
      return {
        success: false,
        error: errorMessage // Return the formatted error message
      };
    }
  }


  async  _deletePayment(payment_history_id: number): Promise<{success: boolean; data?: any; error?: string}> {
 
    try {
      const { data, error } = await this.supabase
        .from('student_payment_history')
        .delete()
        .eq('id', payment_history_id)
        .single();
  
      if (error) {
        return {
          success: false,
          error: error.message || 'Failed to delete payment history'
        };
      }
  
      return {
        success: true,
        data
      };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred while deleting payment';
  
      return {
        success: false,
        error: errorMessage
      };
    }
}

  async getUser(uid:string) {
    const { data, error } = await this.supabase
      .from('user_table')
      .select('id, is_banned, legal_name, is_registered, initiated_name, email, phone, is_admin, student_payment_history( id, student_sessions(session_date, week_num))')
      .eq('id', uid)
      .single();
    return data
 }
}
