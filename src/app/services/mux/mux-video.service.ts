import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class MuxVideoService {
 api = inject(SupabaseService)
  constructor() { }

  async uploadToStorage(file: File): Promise<{ success: boolean; data?: string; error?: string }> {
    try {
      console.log('Uploading video to storage...');
  
      // Upload the file to the specified storage bucket
      const { data, error } = await this.api.getClient()
        .storage
        .from('videos') // Replace 'videos' with your actual storage bucket name
        .upload(`videos/${file.name}`, file);
  
      if (error) {
        console.error('Error uploading to storage:', error.message);
        return { success: false, error: error.message }; // Return the error message
      }
  
      console.log('Upload successful, fetching public URL...');
  
      // Get the public URL for the uploaded file
      const { data: url } = this.api.getClient()
        .storage
        .from('videos')
        .getPublicUrl(`videos/${file.name}`);
  
      if (!url) {
        console.error('Failed to retrieve public URL for uploaded file.');
        return { success: false, error: 'Failed to retrieve public URL.' }; // Handle case where URL is not returned
      }
  
      return { success: true, data: url.publicUrl }; // Return the public URL
    } catch (error) {
      console.error('Error during upload to storage:', error);
      return { success: false, error: 'error uploading video to supabase' }; // Return the error message
    }
  }
  

  async uploadVideo(videoUrl: string): Promise<{ success: boolean; data?: string; error?: string }> {
    try {
      console.log('Initiating video upload...');
  
      // Call the edge function and await the result
      const response = await this.api.getClient().functions.invoke('upload-video', {
        body: { videoUrl: videoUrl }
      });
  
      // Log the full response to the console
      console.log('Upload response:', response);
  
      if (response.error) {
        console.error('Error from function:', response.error.message);
        return { success: false, error: response.error.message }; // Return the error message
      } else {
        console.log('Upload successful, playbackId:', response.data.uploadUrl.data.playback_ids[0].id);
      }
  
      // Return the playback ID if the upload is successful
      return { success: true, data: response.data.uploadUrl.data.playback_ids[0].id };
  
    } catch (error) {
      console.error('Error during upload:', error);
      return { success: false, error: 'error uploading video' }; // Return the error message
    }
  }


  async uploadPlaybackId(playbackId: string): Promise<{ success: boolean; data?: string; error?: string }> {
    try {
      console.log('Initiating video upload...');
  
      // Call the edge function and await the result
      const response = await this.api.getClient().from('videos').insert({
        url: playbackId
      });
  
      // Log the full response to the console
      console.log('Upload response:', response);
  
      if (response.error) {
        console.error('Error from function:', response.error.message);
        return { success: false, error: response.error.message }; // Return the error message
      } 
  
      // Return the playback ID if the upload is successful
      return { success: true, data: 'worked' };
  
    } catch (error) {
      console.error('Error during upload:', error);
      return { success: false, error: 'error during saving the video' }; // Return the error message
    }
  }
  
}
