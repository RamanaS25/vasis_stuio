import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/api/supabase.service';  

@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AudioRecorderComponent  {
  api = inject(SupabaseService)  
  supabase = this.api.getClient()

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recordingInterval: any;
  
  isRecording = false;
  recordingTime = 0;
  audioUrl: string | null = null;
  uploadProgress = 0;

  recordedBlob: Blob | null = null;
  isUploading = false;

  ngOnInit() {}

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.isRecording = true;
      this.recordingTime = 0;

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioUrl = URL.createObjectURL(audioBlob);
        this.recordedBlob = audioBlob;
        this.uploadToSupabase();
      };

      this.mediaRecorder.start();
      this.startTimer();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      this.isRecording = false;
      this.stopTimer();
    }
  }

  private startTimer() {
    this.recordingInterval = setInterval(() => {
      this.recordingTime++;
    }, 1000);
  }

  private stopTimer() {
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
    }
  }

  async uploadToSupabase() {
    if (!this.recordedBlob) return;
    
    this.isUploading = true;
    this.uploadProgress = 0;
    
    try {
      const fileName = `audio_${Date.now()}.webm`;
      
      // Simulate upload progress (real progress tracking would require custom implementation)
      const progressInterval = setInterval(() => {
        if (this.uploadProgress < 90) {
          this.uploadProgress += 10;
        }
      }, 200);

      const { data, error } = await this.supabase.storage
        .from('audio-recordings')
        .upload(fileName, this.recordedBlob, {
          upsert: false
        });

      clearInterval(progressInterval);
      this.uploadProgress = 100;

      if (error) throw error;

      const { data: { publicUrl } } = this.supabase.storage
        .from('audio-recordings')
        .getPublicUrl(fileName);

      console.log('Upload successful:', publicUrl);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      this.isUploading = false;
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  ngOnDestroy() {
    this.stopRecording();
  }

}
