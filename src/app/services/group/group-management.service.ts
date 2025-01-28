import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';
import { Group } from '../../pages/groupm/types';


@Injectable({
  providedIn: 'root'
})
export class GroupManagementService {
 private api = inject(SupabaseService)
 private supabase = this.api.getClient()
 
  constructor() { 
  }

  async getGroups(): Promise<{ success: boolean; data?: Group[]; error?: string }> {
    try {
      const { data, error } = await this.supabase
      .from('student_groups')
      .select('*, student_sessions (*), syllabus_grades(grade)')
      .order('week_num', { referencedTable: 'student_sessions', ascending: true })
      .order('start_date', { ascending: true });
      
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
  
  async insertGroupSessions( group: { name: string, start_date: string, end_date: string, weeks: number } , classes:any ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const { name, start_date, end_date, weeks } = group;
      
      let currentDate = new Date(start_date);
      const finalDate = new Date(end_date);
      
      // Array to hold session data for batch insert
      const sessionData: { session_date: string, week_num: number, group_name: string, class_id?: number }[] = [];
      
      for (let weekNum = 1; weekNum <= weeks; weekNum++) {
        // Format current date to ISO string for insertion
        sessionData.push({
          session_date: currentDate.toISOString(),
          week_num: weekNum,
          group_name: name,
          class_id: this.returnClassId(classes, weekNum)
        });
    
        // Move to the next week's session (add 7 days)
        currentDate.setDate(currentDate.getDate() + 7);
      } 
      console.log(group, classes)
      console.log("session data",sessionData)
    
      // Insert all session data into the student_sessions table
      const { data, error } = await this.supabase.from('student_sessions').insert(sessionData);
      
      if (error) {
        return {
          success: false,
          error: error.message
        };
      }
      
      // Insert start and end dates
      const datesResult = await this.insertStartandEndDates(group);

      if (!datesResult.success) {
        return {
          success: false,
          error: 'Failed to insert start and end dates: ' + datesResult.error
        };
      }

      return {
        success: true,
        data: {
          sessions: data,
          dates: datesResult.data
        }
      };

    } catch (err) {
      return {
        success: false,
        error: 'An unexpected error occurred: ' + (err instanceof Error ? err.message : String(err))
      };
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
        console.log("error",error)
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
    const { name, start_date, end_date, weeks } = group;
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

        // If no existing sessions, create new ones
        if (!existingSessions || existingSessions.length === 0) {
            // Create new sessions array
            const newSessions = Array.from({ length: weeks }, (_, index) => ({
                session_date: new Date(currentDate.getTime() + (index * 7 * 24 * 60 * 60 * 1000)).toISOString(),
                week_num: index + 1,
                group_name: name,
                class_id: this.returnClassId(classes, index + 1)
            }));

            // Insert new sessions
            const { data: insertedData, error: insertError } = await this.supabase
                .from('student_sessions')
                .insert(newSessions);

            if (insertError) {
                console.error('Error creating new sessions:', insertError);
                return { success: false, error: 'Error creating new sessions' };
            }

            return { success: true, data: insertedData };
        }

        // Rest of the existing update logic
        // ... existing code for updating sessions remains the same ...

        // Array to hold the updated session data
        const updatedSessions = existingSessions.map((session, index) => {
            // Update the session_date field based on the new start date
            const updatedDate = new Date(currentDate);
            currentDate.setDate(currentDate.getDate() + 7); // Move to the next week's session

            // Assign the correct class_id for the week
            const updatedClassId = this.returnClassId(classes, index + 1);

            return {
                ...session,
                session_date: updatedDate.toISOString(),
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

        let update_start_date_end_date = await this.insertStartandEndDates({name: name, start_date: start_date, end_date: end_date, weeks: weeks})
        if(update_start_date_end_date.success){
          console.log('Updated group sessions:', updatedData);
          return { success: true, data: updatedData };
        }else{
          console.log('Error updating start and end dates:', update_start_date_end_date.error);
          return { success: false, error: 'Error updating start and end dates' };
        }
        
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

  async addGroup(group: any, classes:any): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const { data, error } = await this.supabase.from('student_groups').insert(group);

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      let x = await this.insertGroupSessions(group, classes)
      if(x.success){
        console.log('Inserted Start and End Dates:', x.data);
       }else{
        console.log("error",x)
        return {
          success: false,
          error: "failed to insert start and end dates"
        }
       }

       

      return {
        success: true,
        data: data
      };
    } catch (err) {
      let errorMessage = 'An unexpected error occurred';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async deleteGroup(group: any) : Promise<{ success: boolean; data?: any; error?: string }>  {
    const { data, error } = await this.supabase.from('student_groups').delete().eq('id', group.id);
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
  } 

  async updateZoomLink(group: any, zoom_link: string) {

    try {
      const { data, error } = await this.supabase
      .from('student_groups')
      .update({ zoom_link: zoom_link })
      .eq('id', group.id);
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

}