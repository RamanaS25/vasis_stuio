import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class NotationsService {
  api = inject(SupabaseService)
  supabase = this.api.getClient()
  constructor() { }

   async getNotations(grade:number) {
    try {
      const { data, error } = await this.supabase
        .from('syllabus_classes')
        .select('id, name, pdf_link, level_id!inner(grade_id!inner(grade))')
        .eq('level_id.grade_id.grade', grade);

      if (error) {
        return {
          success: false,
          error: error.message // Supabase-specific error message
        };
      }

      return {
        success: true,
        data: data // Return processed data with 'finished' property
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

  async updateNotationLink(notationId: number, newPdfLink: string) {
    try {
      const { data, error } = await this.supabase
        .from('syllabus_classes')
        .update({ pdf_link: newPdfLink })
        .eq('id', notationId)
        .select();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: data[0]
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

  
}
