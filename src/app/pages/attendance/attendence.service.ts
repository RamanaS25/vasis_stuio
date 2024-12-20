import { Injectable, inject } from '@angular/core';
import { SupabaseService } from 'src/app/services/api/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AttendenceService {
  api = inject(SupabaseService);
  constructor() { }

  async getAttendance(course_id: number) {
    // Get sessions data
    const { data: sessionData, error } = await this.api.getClient()
      .from('student_sessions')
      .select('week_num, id, group_name(name, weeks, course_id(id))')
      .eq('group_name.course_id', course_id);

    // Get user data with attendance info
    const { data: userData, error: userError } = await this.api.getClient()
      .from('user_table')
      .select('id, user_name, syllabus_attendance(student_id, session_id), group_name');

    if (error || userError) {
      console.error('Error fetching data:', error || userError);
      throw error || userError;
    }

    // Restructure data to have groups as highest level with students and attendance
    const restructuredData = sessionData?.reduce((acc: any, session: any) => {
      const groupName = session.group_name.name;
      
      if (!acc[groupName]) {
        acc[groupName] = {
          name: groupName,
          weeks: session.group_name.weeks,
          course_id: session.group_name.course_id.id,
          students: [],
          sessions: {}
        };
      }

      if (!acc[groupName].sessions[session.week_num]) {
        acc[groupName].sessions[session.week_num] = {
          id: session.id,
          week_num: session.week_num,
          attendance: []
        };
      }

      // Add students to their groups and their attendance records
      userData?.forEach(user => {
        if (user.group_name === groupName) {
          // Add student if not already added
          if (!acc[groupName].students.find((s: any) => s.id === user.id)) {
            acc[groupName].students.push({
              id: user.id,
              name: user.user_name
            });
          }

          // Add attendance records for this session
          if (user.syllabus_attendance) {
            const sessionAttendance = user.syllabus_attendance.find(
              (a: any) => a.session_id === session.id
            );
            if (sessionAttendance) {
              acc[groupName].sessions[session.week_num].attendance.push({
                student_id: user.id,
                session_id: session.id
              });
            }
          }
        }
      });

      return acc;
    }, {});
    console.log(restructuredData);
    console.log(JSON.stringify(restructuredData, null, 2));
    return restructuredData;
  }

  async setAttendance(session_id: number, student_id: number): Promise<{success: boolean, data?: any, error?: any}> {
    const { data, error } = await this.api.getClient()
      .from('syllabus_attendance')
      .insert({
      
          session_id: session_id,
          student_id: student_id,
          
        
      });

    return {
      success: !error,
      data: data || undefined,
      error: error || undefined
    };
  }

  async removeAttendance(session_id: number, student_id: number): Promise<{success: boolean, data?: any, error?: any}> {
    const { data, error } = await this.api.getClient()
      .from('syllabus_attendance')
      .delete()
      .eq('session_id', session_id)
      .eq('student_id', student_id);

    return {
      success: !error,
      data: data || undefined,
      error: error || undefined
    };
  }
}
