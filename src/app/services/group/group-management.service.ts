import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';
import { Group, StudentSession } from '../../pages/groupm/types';

@Injectable({
  providedIn: 'root'
})
export class GroupManagementService {
 private api = inject(SupabaseService)
 private supabase = this.api.getClient()
  constructor() { }

  async getGroups(): Promise<{ success: boolean; data?: Group[]; error?: string }> {
    try {
      const { data, error } = await this.supabase.from('student_groups').select('*, student_sessions (*)').order('week_num', { referencedTable: 'student_sessions', ascending: true });;
      
      if (error) {
        console.log(error)
        return {
         
          success: false,
          error: error.message // Return the error message if there is an error
        };
      }
  
      return {
        success: true,
        data: data || [] // Return the data if the query was successful
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
    console.log(start_date, end_date)
    let currentDate = new Date(start_date);
    const finalDate = new Date(end_date);
    console.log('hi', currentDate, finalDate)
    // Array to hold session data for batch insert
    const sessionData: { _date: string, week_num: number, group_name: string }[] = [];
    console.log('weeks', weeks)
    for (let weekNum = 1; weekNum <= weeks; weekNum++) {
      // Ensure that the current session date does not exceed the final date
      console.log(currentDate, finalDate)
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

  async removeSessionsForGroup(groupName:string) {
    try {
      // Perform the delete operation based on the group_name
      const { data, error } = await this.supabase
        .from('student_sessions') // Replace with your actual table name
        .delete() // Deletes matching rows
        .eq('group_name', groupName); // Condition to match the group_name
  
      // Handle error from the query
      if (error) {
        return {
          success: false,
          error: error.message, // Return the error message
        };
      }
  
      // Return success with the data (number of rows deleted)
      return {
        success: true,
        data: `sessions deleted for group: ${groupName}`, // Data contains the number of rows deleted
      };
    } catch (err) {
      // Handle unexpected errors
      return {
        success: false,
        error: 'An unexpected error occurred: ' + err,
      };
    }
  }

  async editLiveSession(sessionId: number, updatedData: any) {
    try {
      const { data, error } = await this.supabase
        .from('student_sessions')
        .update(updatedData)
        .eq('id', sessionId);

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: data
      };
    } catch (err) {
      return {
        success: false,
        error: 'An unexpected error occurred: ' + err
      };
    }
  }

  async insertRecordedClass(updated_session: any) {
    try {
      const { data, error } = await this.supabase
        .from('student_sessions')
        .update({ recorded_class: updated_session.recorded_class })
        .eq('id', updated_session.id);
         
        if (error) return {
          success: false,
          error: error.message
          };

      return {
        success: true,
        data: data
      };
    } catch (err) {
        return {
          success: false,
        }
    }
  }

}