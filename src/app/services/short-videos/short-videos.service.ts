import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';
import { LoginService } from '../auth/login.service';

@Injectable({
  providedIn: 'root'
})
export class ShortVideosService {
 private api = inject(SupabaseService)
 private auth = inject(LoginService)
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
            student_sessions (*),
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
        .eq('syllabus_classes.syllabus_videos.voice_scale', this.auth._user.voice_scale)
       
      // Handle any errors from the query
      if (error) throw error;


  
      // Check if levels data exists
      if (!levels || levels.length === 0) {
        return { success: false, error: 'No data found for grade one' };
      }

      if (levels && !error) {
        levels.forEach(level => {
          level.syllabus_classes.forEach(syllabusClass => {
            syllabusClass.syllabus_videos.sort((a, b) => a.auto_play_id - b.auto_play_id); // Ascending order
          });
        });
      }
      
  
      // Transform the data into the required structure
      const structuredData = levels.map(level => ({
        level_name: level.name,
        classes: level.syllabus_classes.map(classItem => ({
          class_id: classItem.id,
          class_name: classItem.name,
          locked: this.isDateInFuture(classItem.student_sessions[0]._date),
          session_date: classItem.student_sessions[0]._date,
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

  isDateInFuture(dateTimeString: string): boolean {
    const inputDate = new Date(dateTimeString);
    const currentDate = new Date();
    
    return inputDate.getTime() > currentDate.getTime();
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
  async updateVideo(video: {
    id: number;
    title: string;
    video_id: string;
    title_s: string;
    title_p: string;
    is_melody: boolean;
  }) {
    const { data, error } = await this.supabase
      .from('syllabus_videos')
      .update({
        title: video.title,
        video_id: video.video_id,
        title_s: video.title_s,
        title_p: video.title_p,
        is_melody: video.is_melody,
      })
      .eq('id', video.id);
  
    if (error) {
      return { success: false, error };
    }
    
    return { success: true, data };
  }
  
  
  async deleteVideo(video: any) {
    let { data, error } = await this.supabase.from('syllabus_videos').delete().eq('id', video.id);
    if (error) {
      return { success: false, error };
    } else {
      return { success: true, data };
    }
  }

  async saveVideoProgress(video_progress: {video_id: number, student_id: number}) {
    try {
      const { data, error } = await this.supabase
        .from('student_video_progress')
        .upsert(video_progress, {
          onConflict: 'video_id,student_id',
          ignoreDuplicates: false
        })
  
      if (error) {
        throw error;
      }
  
      return { success: true, data };
    } catch (error) {
      console.error('Error saving video progress:', error);
      return { success: false, error };
    }
  }
  
}
