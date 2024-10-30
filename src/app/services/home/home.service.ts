import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private api = inject(SupabaseService);
  supabase = this.api.getClient();

  constructor() {}

  async getHome() {
    try {
      const { data, error } = await this.supabase
        .from('home_text')
        .select('*')
        .order('id');
      if (error) {
        return { success: false, error };
      } else {
        return { success: true, data };
      }
    } catch (e) {
      return { success: false, error: e };
    }
  }

  async editTextEng(
    text: {
      id: number;
      message: string;
      link: string;
      video_title: string;
      video_id: string;
    }[]
  ) {
    try {
      for (let item of text) {
        const { data, error } = await this.supabase
          .from('home_text')
          .update({
            message_e: item.message,
            link: item.link,
            video_title_e: item.video_title,
            video_id: item.video_id,
          })
          .eq('id', item.id);
        if (error) {
          console.error('Ошибка при обновлении элемента с id:', item.id, error);
          // Прерываем выполнение и возвращаем ошибку
          return { success: false, error };
        }

        console.log('Успешное обновление элемента с id:', item.id);
      }
      return { success: true };
    } catch (error) {
      console.error('Произошла ошибка:', error);
      return { success: false, error };
    }
  }
  async editTextSp(
    text: {
      id: number;
      message: string;
      link: string;
      video_title: string;
      video_id: string;
    }[]
  ) {
    try {
      for (let item of text) {
        const { data, error } = await this.supabase
          .from('home_text')
          .update({
            message_s: item.message,
            link: item.link,
            video_title_s: item.video_title,
            video_id: item.video_id,
          })
          .eq('id', item.id);
        if (error) {
          console.error('Ошибка при обновлении элемента с id:', item.id, error);
          // Прерываем выполнение и возвращаем ошибку
          return { success: false, error };
        }

        console.log('Успешное обновление элемента с id:', item.id);
      }
      return { success: true };
    } catch (error) {
      console.error('Произошла ошибка:', error);
      return { success: false, error };
    }
  }
  async editTextPor(
    text: {
      id: number;
      message: string;
      link: string;
      video_title: string;
      video_id: string;
    }[]
  ) {
    try {
      for (let item of text) {
        const { data, error } = await this.supabase
          .from('home_text')
          .update({
            message_p: item.message,
            link: item.link,
            video_title_p: item.video_title,
            video_id: item.video_id,
          })
          .eq('id', item.id);
        if (error) {
          console.error('Ошибка при обновлении элемента с id:', item.id, error);
          // Прерываем выполнение и возвращаем ошибку
          return { success: false, error };
        }

        console.log('Успешное обновление элемента с id:', item.id);
      }
      return { success: true };
    } catch (error) {
      console.error('Произошла ошибка:', error);
      return { success: false, error };
    }
  }
  async getImage(name: string) {
    const { data } = this.supabase.storage
      .from('images') // Название вашего бакета
      .getPublicUrl(`home_page/${name}`); // Путь к файлу

    if (!data.publicUrl) {
      console.error('Не удалось получить URL изображения');
      return null;
    }

    // Возвращаем публичный URL
    console.log('service', data.publicUrl);
    return data.publicUrl;
  }

  async uploadImage(file: any, id: number) {
    try {
      const { data, error } = await this.supabase.storage
        .from('images')
        .upload(`home_page/${file.name}`, file);

      if (error) {
        console.error('Ошибка загрузки изображения:', error);
        return null;
      }

      // Получаем публичный URL для загруженного изображения
      const { data: publicUrlData } = this.supabase.storage
        .from('images')
        .getPublicUrl(`home_page/${file.name}`);

      if (publicUrlData?.publicUrl) {
        this.editImg(publicUrlData.publicUrl, id);
        console.log(
          'Успешная загрузка и получение URL:',
          publicUrlData.publicUrl
        );
        return publicUrlData.publicUrl;
      } else {
        console.error('Ошибка получения публичного URL');
        return null;
      }
    } catch (error) {
      console.error('Произошла ошибка:', error);
      return null;
    }
  }
  async editImg(name: string, id: number) {
    try {
      const { data, error } = await this.supabase
        .from('home_text')
        .update({ img: name })
        .eq('id', id);
      if (error) {
        console.error('Ошибка при обновлении элемента с id:', id, error);
        // Прерываем выполнение и возвращаем ошибку
        return { success: false, error };
      } else {
        console.log('Успешное обновление элемента с id:', id);
        return { success: true };
      }
    } catch (error) {
      console.error('Произошла ошибка:', error);
      return { success: false, error };
    }
  }
}
