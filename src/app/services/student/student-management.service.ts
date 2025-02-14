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
        .select('*')
        .eq('is_admin', false);

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
        .select('*')
        .eq('is_active', true);

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
   user:any
  ) {
    try {
      const { data, error } = await this.supabase
        .from('user_table')
        .update(user)
        .eq('id', user.id);

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
