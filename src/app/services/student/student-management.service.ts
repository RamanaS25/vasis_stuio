import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class StudentManagementService {
  private api = inject(SupabaseService);
  supabase = this.api.getClient();
  constructor() {}

  async getAllStudents() {
    try {
      const { data, error } = await this.supabase
        .from('user_table')
        .select('*');

      if (error) {
        return {
          success: false,
          error: error.message, // Supabase-specific error message
        };
      }

      return {
        success: true,
        data: data, // Return the data if the query was successful
      };
    } catch (err) {
      // Type-safe handling of the 'unknown' error type
      let errorMessage = 'An unexpected error occurred';

      if (err instanceof Error) {
        errorMessage = err.message; // Safely access the error message
      }

      return {
        success: false,
        error: errorMessage, // Return the formatted error message
      };
    }
  }

  async getAllGrops() {
    try {
      const { data, error } = await this.supabase
        .from('student_groups')
        .select('*');

      if (error) {
        return {
          success: false,
          error: error.message, // Supabase-specific error message
        };
      }

      return {
        success: true,
        data: data, // Return the data if the query was successful
      };
    } catch (err) {
      // Type-safe handling of the 'unknown' error type
      let errorMessage = 'An unexpected error occurred';

      if (err instanceof Error) {
        errorMessage = err.message; // Safely access the error message
      }

      return {
        success: false,
        error: errorMessage, // Return the formatted error message
      };
    }
  }

  async editUser(
    id: number,
    email: string,
    phone: string,
    level: string,
    voiceScale: string,
    language: string,
    groupName: string,
    is_registered: boolean
  ) {
    try {
      const { data, error } = await this.supabase
        .from('user_table')
        .update({
          email: email,
          phone: phone,
          grade: level,
          voice_scale: voiceScale,
          language: language,
          group_name: groupName,
          is_registered: is_registered,
        })
        .eq('id', id);

      if (error) {
        return {
          success: false,
          error: error.message, // Supabase-specific error message
        };
      }

      return {
        success: true,
      };
    } catch (err) {
      // Type-safe handling of the 'unknown' error type
      let errorMessage = 'An unexpected error occurred';

      if (err instanceof Error) {
        errorMessage = err.message; // Safely access the error message
      }

      return {
        success: false,
        error: errorMessage, // Return the formatted error message
      };
    }
  }

  async deleteUser(id: number) {
    try {
      const { data, error } = await this.supabase
        .from('user_table')
        .delete()
        .eq('id', id);

      if (error) {
        return {
          success: false,
          error: error.message, // Supabase-specific error message
        };
      }

      return {
        success: true,
      };
    } catch (err) {
      // Type-safe handling of the 'unknown' error type
      let errorMessage = 'An unexpected error occurred';

      if (err instanceof Error) {
        errorMessage = err.message; // Safely access the error message
      }

      return {
        success: false,
        error: errorMessage, // Return the formatted error message
      };
    }
  }
}
