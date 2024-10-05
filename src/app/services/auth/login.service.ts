import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  api = inject(SupabaseService)
  supabase = this.api.getClient()

  constructor() { }

   async login(email: string, password: string) {
     
  }
}
