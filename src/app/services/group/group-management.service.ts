import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';

interface OldData {
  // Original columns from the old table
  id: number
  username: string | null;
  password: string | null;
  admin: number;
  firstName: string | null;
  registered: string;
  phone: string | null;
  email: string | null;
  voiceScale: string;
  languageType: string;
  GroupName: string | null;
  currency_stu: string | null;
  initiatedName: string | null;
  grade: number | null;
  // ... other columns that we will discard
}

interface NewData {
  // Columns matching the Supabase table schema
  id:number,
  email: string | null;
  password: string | null;
  user_name: string | null;
  initiated_name: string | null;
  legal_name: string | null;
  is_admin: boolean;
  phone: string | null;
  currency: string | null;
  language: string;
  voice_scale: string;
  is_registered: boolean;
  group_name: string | null;
  grade: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class GroupManagementService {
 private api = inject(SupabaseService)
 private supabase = this.api.getClient()
  constructor() { }

  async getGroups() {
    try {
      const { data, error } = await this.supabase.from('student_groups').select('*');
      
      if (error) {
        console.log(error)
        return {
         
          success: false,
          error: error.message // Return the error message if there is an error
        };
      }
  
      return {
        success: true,
        data: data // Return the data if the query was successful
      };
  
    } catch (err) {
      // Handle unexpected errors
      let errorMessage = 'An unexpected error occurred';
  
      if (err instanceof Error) {
        errorMessage = err.message;
      }
  
      return {
        success: false,
        error: errorMessage // Return the unexpected error message
      };
    }
  }
  

  async insertGroupSessions( group: { name: string, start_date: string, end_date: string, weeks: number }) {
    const { name, start_date, end_date, weeks } = group;
   
    // Convert startDate and endDate to Date objects
    let currentDate = new Date(start_date);
    const finalDate = new Date(end_date);
    console.log('hi', currentDate, finalDate)
    // Array to hold session data for batch insert
    const sessionData: { _date: string, week_num: number, group_name: string }[] = [];
  
    for (let weekNum = 1; weekNum <= weeks; weekNum++) {
      // Ensure that the current session date does not exceed the final date
      if (currentDate > finalDate) {
        break;
      }
  
      // Format current date to ISO string for insertion
      sessionData.push({
        _date: currentDate.toISOString(),
        week_num: weekNum,
        group_name: name
      });
  
      // Move to the next week's session (add 7 days)
      currentDate.setDate(currentDate.getDate() + 7);
    }

    console.log(sessionData)
  
    // Insert all session data into the student_sessions table
    const { data, error } = await this.supabase.from('student_sessions').insert(sessionData);
  
    if (error) {
      console.error('Error inserting group sessions:', error);
      return false
      
    } else {
      console.log('Inserted group sessions:', data);
      return true
      
    }

  }


}