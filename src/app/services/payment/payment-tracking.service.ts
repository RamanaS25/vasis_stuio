import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';

@Injectable({
  providedIn: 'root'
})

export class PaymentTrackingService {
  
  api = inject(SupabaseService)
  supabase = this.api.getClient()
  constructor() { }

  async getStudents() {
    try {
      const { data, error } = await this.supabase
        .from('student_groups')
        .select('name, start_date, end_date, user_table( id, is_banned, legal_name, is_registered, initiated_name, email, phone, is_admin, student_payment_history( id, student_sessions(_date, week_num)))')
        .eq('user_table.is_admin', false)
        .eq('user_table.is_registered', false);
      
      if (error) {
        return {
          success: false,
          error: error.message // Supabase-specific error message
        };
      }
  
      // Add the 'finished' property based on the 'end_date'
      const currentDate = new Date();
      const processedData = data.map((group: any) => ({
        ...group,
        finished: new Date(group.end_date) < currentDate // Set 'finished' based on 'end_date'
      }));
  
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
        .insert(paymentData);
  
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
}
