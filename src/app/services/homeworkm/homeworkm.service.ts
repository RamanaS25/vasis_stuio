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
        .select('grade, syllabus_levels(name, syllabus_classes(name, id, syllabus_homework(id,title_s, title_p, title, is_exercise, week_num)))')
        
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
              id: classItem.id,
              homework: classItem.homework
            }))
          }))
        }
      })

      console.log('renamedData',renamedData)
  
      return { success: true, data: renamedData }
    } catch (error) {
      console.warn(error)
      return { success: false, error: 'Unexpected error fetching homework' }
    }
  }


  async upsertHomework(homework:any): Promise<{success:boolean, data?:any, error?:string}> {
    try {
      const {data, error} = await this.api.getClient()
        .from('syllabus_homework')
        .upsert(homework)

      if (error) {
        console.warn(error)
        return { success: false, error: error.message || 'Error upserting homework' }
      }

      return { success: true, data }
    } catch (error) {
      console.warn(error) 
      return { success: false, error: 'Unexpected error upserting homework' }
    }
  }

  async deleteHomework(id:string):Promise<{success:boolean, data?:any, error?:string}> {
    try {
      const {data, error} = await this.api.getClient()
        .from('syllabus_homework')
        .delete()
        .eq('id', id)

      if (error) {
        console.warn(error)
        return { success: false, error: error.message || 'Error deleting homework' }
      }

      return { success: true, data }
    } catch (error) {
      console.warn(error)
      return { success: false, error: 'Unexpected error deleting homework' }
    }
  }
  
  
  async get_groups_with_students_homework(is_graded: boolean):Promise<{success:boolean, data?:any, error?:string}> {
    try {
      const { data, error } = await this.api.getClient()
        .from('student_groups')
        .select(`
          name,
          user_table!inner(
            legal_name,
            initiated_name,
            email,
            phone,
            id,
            student_homework!inner(
              *,
              syllabus_homework(title, is_exercise)
            )
          )
        `)
        .eq('user_table.student_homework.graded', is_graded)

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

  async submit_homework_grades(grades:any):Promise<{success:boolean, data?:any, error?:string}>{
    try {
      const {data, error} = await this.api.getClient()
        .from('student_homework')
        .update(grades) 
        .eq('id', grades.id)

      if (error) {
        console.warn(error)
        return { success: false, error: error.message || 'Error submitting grades' }
      }

      return { success: true, data }
    } catch (error) {
      console.warn(error)
      return { success: false, error: 'Unexpected error submitting grades' }
    }
  }

  async delete_homework_from_student(student_id:string, homework_id:string):Promise<{success:boolean, data?:any, error?:string}>{
    try {
      const {data, error} = await this.api.getClient()
        .from('student_homework')
        .delete()
        .eq('id', homework_id)
        .eq('student_id', student_id)

      if (error) {
        console.warn(error)
        return { success: false, error: error.message || 'Error deleting homework from student' }
      }

      return { success: true, data }
    } catch (error) {
      console.warn(error)
      return { success: false, error: 'Unexpected error deleting homework from student' }
    }
  }

}
