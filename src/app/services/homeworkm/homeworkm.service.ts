import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class HomeworkmService {
 api = inject(SupabaseService)
  constructor() { }

  async getHomework() {
    try {
      const { data, error } = await this.api.getClient()
        .from('syllabus_grades')
        .select('grade, syllabus_levels(name, syllabus_classes(name, syllabus_homework(title_s, title_p, title, is_exercise, week_num)))')
  
      if (error) {
        console.warn(error)
        return { success: false, error: error.message || 'Error fetching homework' }
      }
  
      // Safely create a new structure without the syllabus_ prefix
      const renamedData = data.map(grade => ({
        ...grade,
        levels: grade.syllabus_levels.map(level => ({
          ...level,
          classes: level.syllabus_classes.map(classItem => ({
            ...classItem,
            homework: classItem.syllabus_homework
          }))
        }))
      })).map(grade => {
        // Create new grade object without 'syllabus_' keys
        return {
          grade: grade.grade,
          levels: grade.levels.map(level => ({
            name: level.name,
            classes: level.classes.map(classItem => ({
              name: classItem.name,
              homework: classItem.homework
            }))
          }))
        }
      })
  
      return { success: true, data: renamedData }
    } catch (error) {
      console.warn(error)
      return { success: false, error: 'Unexpected error fetching homework' }
    }
  }
  
  
  async get_groups_with_students_homework():Promise<{success:boolean, data?:any, error?:string}>{
    try {
      const { data, error } = await this.api.getClient()
        .from('student_groups')
        .select('name, user_table!inner(legal_name, initiated_name, email, phone, id, student_homework!inner(*, syllabus_homework(title, is_exercise)))')
        .not('user_table.student_homework', 'is', null)

      if (error) {
        console.warn(error)
        return { success: false, error: error.message || 'Error fetching groups data' }
      }

      return { success: true, data }

    } catch (error) {
      console.warn(error)
      return { success: false, error: 'Unexpected error fetching groups data' }
    }
  }
  

}
