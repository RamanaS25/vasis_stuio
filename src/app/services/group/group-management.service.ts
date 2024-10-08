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
      const { data, error } = await this.supabase.from('student_groups').select('*, student_sessions (*), syllabus_grades(grade)').order('week_num', { referencedTable: 'student_sessions', ascending: true });;
      
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

  async getClasses(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from('syllabus_classes')
        .select('*, syllabus_levels(syllabus_grades(grade))')
    

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
        error: 'An unexpected error occurred: ' + (err instanceof Error ? err.message : String(err))
      };
    }
  }

  returnClassId(classes: any[], week_num: number): number | undefined {
    const classObj = classes.find(c => {
      const classNumber = parseInt(c.name.split(' ')[1]);
      return classNumber === week_num;
    });
    return classObj?.id;
  }
  
  async insertGroupSessions( group: { name: string, start_date: string, end_date: string, weeks: number } , classes:any ) {
    const { name, start_date, end_date, weeks } = group;
    
    // Convert startDate and endDate to Date objects
    console.log(start_date, end_date)
    let currentDate = new Date(start_date);
    const finalDate = new Date(end_date);
    console.log('hi', currentDate, finalDate)
    // Array to hold session data for batch insert
    const sessionData: { _date: string, week_num: number, group_name: string, class_id?: number }[] = [];
    console.log('weeks', weeks)
    
    for (let weekNum = 1; weekNum <= weeks; weekNum++) {
      // Ensure that the current session date does not exceed the final date
      console.log(currentDate, finalDate)
    
  
      // Format current date to ISO string for insertion
      sessionData.push({
        _date: currentDate.toISOString(),
        week_num: weekNum,
        group_name: name,
        class_id: this.returnClassId(classes, weekNum)
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
     let x = await this.insertStartandEndDates(group)
     if(x.success){
      console.log('Inserted Start and End Dates:', x.data);
     }else{
      console.log('Error Inserting Start and End Dates:', x.error);
     }
      console.log('Inserted group sessions:', data);
      return true
      
    }

  }

  async insertStartandEndDates(group: any) {
    const { name, start_date, end_date, weeks } = group;
    try {
      const { data, error } = await this.supabase
        .from('student_groups')
        .update({ start_date, end_date })
        .eq('name', name);

      if (error) {
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      return {
        success: true,
        data: data,
        error: null
      };
    } catch (err) {
      return {
        success: false,
        error: 'An unexpected error occurred: ' + err,
        data: null
      };
    }
  }

  async updateGroupSessions(group: { name: string, start_date: string, end_date: string, weeks: number }, classes: any): Promise<{ success: boolean; data?: any; error?: string }> {
    const { name, start_date, weeks } = group;

    // Convert start_date to a Date object
    let currentDate = new Date(start_date);

    try {
        // Fetch the existing sessions for the group
        const { data: existingSessions, error: fetchError } = await this.supabase
            .from('student_sessions')
            .select('*')
            .eq('group_name', name)
            .order('week_num', { ascending: true });

        if (fetchError) {
            console.error('Error fetching existing sessions:', fetchError);
            return { success: false, error: 'Error fetching existing sessions' };
        }

        if (!existingSessions || existingSessions.length === 0) {
            console.error('No existing sessions found for the group:', name);
            return { success: false, error: 'No existing sessions found for the group' };
        }

        // Array to hold the updated session data
        const updatedSessions = existingSessions.map((session, index) => {
            // Update the _date field based on the new start date
            const updatedDate = new Date(currentDate);
            currentDate.setDate(currentDate.getDate() + 7); // Move to the next week's session

            // Assign the correct class_id for the week
            const updatedClassId = this.returnClassId(classes, index + 1);

            return {
                ...session,
                _date: updatedDate.toISOString(),
                class_id: updatedClassId,
            };
        });

        // Batch update the sessions with the new dates and class_ids
        const { data: updatedData, error: updateError } = await this.supabase
            .from('student_sessions')
            .upsert(updatedSessions);

        if (updateError) {
            console.error('Error updating group sessions:', updateError);
            return { success: false, error: 'Error updating group sessions' };
        }

        console.log('Updated group sessions:', updatedData);
        return { success: true, data: updatedData };
    } catch (err) {
        console.error('An unexpected error occurred while updating sessions:', err);
        return { success: false, error: 'An unexpected error occurred while updating sessions' };
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