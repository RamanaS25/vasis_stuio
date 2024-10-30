import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';
@Injectable({
  providedIn: 'root',
})
export class TutorialService {
  private api = inject(SupabaseService);
  supabase = this.api.getClient();
  constructor() {}

  async getTutorials() {
    try {
      const { data, error } = await this.supabase
        .from('tutorial_video')
        .select('*')
        .order('order_number');
      if (error) {
        return { success: false, error };
      } else {
        return { success: true, data };
      }
    } catch (e) {
      return { success: false, error: e };
    }
  }
  async getTutorial_text() {
    try {
      const { data, error } = await this.supabase
        .from('tutorial_text')
        .select('*');
      if (error) {
        return { success: false, error };
      } else {
        return { success: true, data };
      }
    } catch (e) {
      return { success: false, error: e };
    }
  }

  async newVideo(video: any) {
    try {
      const { data, error } = await this.supabase
        .from('tutorial_video')
        .insert({
          video_id: video.video_id,
          title_e: video.title_e,
          title_s: video.title_s,
          title_p: video.title_p,
          group_title_e: video.group_title_e,
          group_title_s: video.group_title_s,
          group_title_p: video.group_title_p,
          order_number: video.order_number,
        });
      if (error) {
        console.log(error);
        return { success: false, error };
      } else {
        return { success: true, data };
      }
    } catch (e) {
      console.log(e);
      return { success: false, error: e };
    }
  }

  async editVideo(item: any) {
    console.log('service', item);
    try {
      const { data, error } = await this.supabase
        .from('tutorial_video')
        .update({
          video_id: item.video_id,
          title_e: item.title_e,
          title_s: item.title_s,
          title_p: item.title_p,
          group_title_e: item.group_title_e,
          group_title_s: item.group_title_s,
          group_title_p: item.group_title_p,
          order_number: item.order_number,
        })
        .eq('id', item.id);
      if (error) {
        console.log(error);
        return { success: false, error };
      } else {
        return { success: true, data };
      }
    } catch (e) {
      console.log(e);
      return { success: false, error: e };
    }
  }

  async deleteVideo(item: any) {
    console.log('service', item);
    try {
      const { data, error } = await this.supabase
        .from('tutorial_video')
        .delete()
        .eq('id', item.id);
      if (error) {
        console.log(error);
        return { success: false, error };
      } else {
        return { success: true, data };
      }
    } catch (e) {
      console.log(e);
      return { success: false, error: e };
    }
  }

  async editTextEng(
    page_text: {
      id: number;
      question: string;
      answer: string;
      tips: string;
      video_title: string;
      video_id: string;
    }[]
  ) {
    try {
      for (let item of page_text) {
        const { data, error } = await this.supabase
          .from('tutorial_text')
          .update({
            question_e: item.question,
            answer_e: item.answer,
            tips_e: item.tips,
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

      // Возвращаем успешный результат после завершения цикла
      console.log('Все элементы успешно обновлены');
      return { success: true };
    } catch (error) {
      console.error('Произошла ошибка:', error);
      return { success: false, error };
    }
  }

  async editTextSpn(
    page_text: {
      id: number;
      question: string;
      answer: string;
      tips: string;
      video_title: string;
      video_id: string;
    }[]
  ) {
    try {
      for (let item of page_text) {
        const { data, error } = await this.supabase
          .from('tutorial_text')
          .update({
            question_s: item.question,
            answer_s: item.answer,
            tips_s: item.tips,
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

      // Возвращаем успешный результат после завершения цикла
      console.log('Все элементы успешно обновлены');
      return { success: true };
    } catch (error) {
      console.error('Произошла ошибка:', error);
      return { success: false, error };
    }
  }
  async editTextPor(
    page_text: {
      id: number;
      question: string;
      answer: string;
      tips: string;
      video_title: string;
      video_id: string;
    }[]
  ) {
    try {
      for (let item of page_text) {
        const { data, error } = await this.supabase
          .from('tutorial_text')
          .update({
            question_p: item.question,
            answer_p: item.answer,
            tips_p: item.tips,
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

      // Возвращаем успешный результат после завершения цикла
      console.log('Все элементы успешно обновлены');
      return { success: true };
    } catch (error) {
      console.error('Произошла ошибка:', error);
      return { success: false, error };
    }
  }
}
