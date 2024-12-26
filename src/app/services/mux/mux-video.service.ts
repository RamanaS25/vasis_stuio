import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';

export interface Homework {
  id: string;
  title: string;
  title_s: string;
  title_p: string;
  is_exercise: boolean;
  student_homework: any[];
}

@Injectable({
  providedIn: 'root'
})
export class MuxVideoService {
 api = inject(SupabaseService)
 private upload_progress: number = 0
  constructor() { }

  getUploadProgress(){
    return this.upload_progress.toFixed(2)
  }
  
  async uploadVideo(video:Blob, user_id: string, homework: Homework): Promise<{ success: boolean; data?: string; error?: string }> {
    try {
      console.log('Initiating video upload...');
  
      // GET THE UPLOAD LINK FROM MUX
      const urlData = await this.api.getClient().functions.invoke('upload-video');
  
      // Log the full response to the console
      console.log('Upload response:', urlData);
  
      if (urlData.error) {
        console.error('Error getting Upload Link:');
        return { success: false, error: 'Error getting Upload Link' }; // Return the error message
      } else {

          // UPLOADING VIDEO TO MUX
          const xhr = new XMLHttpRequest();
          
          // Create a promise to handle the upload
          const uploadPromise = new Promise((resolve, reject) => {
            xhr.upload.addEventListener('progress', (event) => {
              if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
                this.upload_progress = percentComplete
              }
            });

            xhr.addEventListener('load', () => resolve(xhr.response));
            xhr.addEventListener('error', () => reject(xhr.statusText));
            
            xhr.open('PUT', urlData.data.data.url);
            xhr.setRequestHeader('Content-Type', video.type);
            xhr.send(video);
          });

          await uploadPromise;

          if(xhr.status !== 200){
            return { success: false, error: 'Error Uploading Video' };
          }
    
         // SAVE THE HOMEWORK TO THE DATABASE
         console.log('uploading to database',homework)
          const { data: homeworkData, error: homeworkError } = await this.api.getClient()
          .from('student_homework')
          .insert({
            homework_id: homework.id, 
            student_id: user_id,
            upload_id: urlData.data.data.id,
            status: 'pending'
          });

          if (homeworkError) {
            console.error('Error from function:', homeworkError.message);
            return { success: false, error: homeworkError.message }; // Return the error message
          }

          return { success: true, data: 'playback_id' };  

      }

  
    } catch (error) {
      console.error('Error during upload:', error);
      return { success: false, error: 'error uploading video' }; // Return the error message
    }
  }

 async getUploadUrl(){
   let x = await this.api.getClient().functions.invoke('upload-video');
   console.log('x',x)
   return x
  }


  async getHomeworkByGrade(grade: number, user_id: number): Promise<{ success: boolean; data?: Homework[]; error?: string }> {
    try {
      // Query the syllabus_homework table filtered by grade
      const { data, error } = await this.api.getClient()
        .from('syllabus_homework')
        .select(`
          *,
          class_id!inner (
            name,
            id,
            level_id!inner (
              id,
              grade_id!inner (
                grade
              )
            )
          ),
          student_homework!homework_id (
            *,
            student_id
          )
        `)
        .eq('class_id.level_id.grade_id.grade', grade)
        .eq('student_homework.student_id', user_id);
      
        console.warn(data)
      if (error) {
        console.error('Error fetching homework:', error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data: data };

    } catch (error) {
      console.error('Error fetching homework:', error);
      return { success: false, error: 'Error fetching homework data' };
    }
  }
  
}
