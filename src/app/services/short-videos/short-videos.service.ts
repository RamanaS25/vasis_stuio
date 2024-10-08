import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ShortVideosService {
 private api = inject(SupabaseService)
 private supabase = this.api.getClient()
 
  constructor() { }

  async getGradeOneData(grade:number) {
    try {
      // Fetch all levels, classes, and videos for grade one
      let { data: levels, error } = await this.supabase
        .from('syllabus_levels')
        .select(`
          id,
          name,
          syllabus_grades!inner (
            grade
          ),
          syllabus_classes (
            id,
            name,
            syllabus_videos (
            id,
            class_id,
              title,
              duration,
              video_id,
              auto_play_id,
              voice_scale,
              is_melody,
              title_s,
              title_p,
              student_video_progress (
                id
              )
            )
          )
        `)
        .eq('syllabus_grades.grade', grade)
        .eq('syllabus_classes.syllabus_videos.voice_scale', 'B4')
   
      // Handle any errors from the query
      if (error) throw error;
  
      // Check if levels data exists
      if (!levels || levels.length === 0) {
        return { success: false, error: 'No data found for grade one' };
      }
  
      // Transform the data into the required structure
      const structuredData = levels.map(level => ({
        level_name: level.name,
        classes: level.syllabus_classes.map(classItem => ({
          class_id: classItem.id,
          class_name: classItem.name,
          videos: classItem.syllabus_videos.map(video => ({
            id: video.id,
            class_id: video.class_id,
            title: video.title,
            duration: video.duration,
            video_id: video.video_id,
            auto_play_id: video.auto_play_id,
            voice_scale: video.voice_scale,
            is_melody: video.is_melody,
            title_s: video.title_s,
            title_p: video.title_p,
            student_video_progress: (video.student_video_progress.length > 0) ? true : false
          }))
        }))
      }));
  
      return { success: true, data: structuredData };
    }  catch (error: unknown) {
      console.error('Error in getGradeOneData:', error);
      return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' };
    }
  }

  async addVideo(video: any) {
    let { data, error } = await this.supabase.from('syllabus_videos').insert(video);
    console.log(data,error)
    if (error) {
      return { success: false, error };
    } else {
      return { success: true, data };
    }
  }
  
  async updateVideo(video: any) {
    let { data, error } = await this.supabase.from('syllabus_videos').update(video).eq('id', video.id);
    if (error) {
      return { success: false, error };
    } else {
      return { success: true, data };
    }
  }
  
  async deleteVideo(video: any) {
    let { data, error } = await this.supabase.from('syllabus_videos').delete().eq('id', video.id);
    if (error) {
      return { success: false, error };
    } else {
      return { success: true, data };
    }
  }
}
