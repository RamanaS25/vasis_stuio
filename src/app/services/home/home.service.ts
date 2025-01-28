import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private api = inject(SupabaseService);
  supabase = this.api.getClient();

  constructor() {}

  async getHomeContent() {
    const { data, error } = await this.supabase
      .from('home_screen')
      .select('*')
      .eq('id', 1);

    if (error) {
      return { success: false, error };
    } else {
      return { success: true, data: data[0] };
    }
  }

  async updateHomeContent(home_content: any) {
    const { data, error } = await this.supabase
      .from('home_screen')
      .update(home_content)
      .eq('id', 1)
      .select('*');
    if (error) {
      return { success: false, error };
    } else {
      return { success: true, data: data[0] };
    }
  }

  async getImagesFromStorage() {
    const { data, error } = await this.supabase.storage
      .from('images')
      .list('home_page/');
    if (error) {
      return { success: false, error };
    } else {
      return { success: true, data: data };
    }
  }

  async uploadImage(file: File): Promise<{ success: boolean; data?: string; error?: string }> {
    try {
      const { data, error } = await this.supabase.storage
        .from('images')
        .upload(`home_page/${file.name}`, file);

      if (error) {
        return {
          success: false,
          error: `Image upload error: ${error.message}`,
        };
      }

      const { data: publicUrlData } = this.supabase.storage
        .from('images')
        .getPublicUrl(`home_page/${file.name}`);

      if (publicUrlData?.publicUrl) {
        return {
          success: true,
          data: publicUrlData.publicUrl,
        };
      } else {
        return {
          success: false,
          error: 'Failed to get public URL',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Unexpected error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }
}
