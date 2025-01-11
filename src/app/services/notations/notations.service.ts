import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class NotationsService {
  api = inject(SupabaseService)
  supabase = this.api.getClient()
  sanitizer = inject(DomSanitizer)
  constructor() { }

   async getNotations(grade:number, group_name:string) {
    console.log('group_name', group_name)
    try {
      const { data, error } = await this.supabase
        .from('syllabus_classes')
        .select('id, name, pdf_link, pdf_link_por, pdf_link_s, level_id!inner(grade_id!inner(grade)), student_sessions(session_date, group_name)')
        .eq('student_sessions.group_name', group_name)
        .eq('level_id.grade_id.grade', grade)
        .order('id', { ascending: true })
        

        console.log(data)
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


  async updateNotationLink(notationId: number, updatedNotation: any) {
    try {
      const { data, error } = await this.supabase
        .from('syllabus_classes')
        .update({
            pdf_link: updatedNotation.pdf_link,
            pdf_link_por: updatedNotation.pdf_link_por,
            pdf_link_s: updatedNotation.pdf_link_s,
        })
        .eq('id', notationId)
        .select('id, pdf_link, pdf_link_por, pdf_link_s');

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
