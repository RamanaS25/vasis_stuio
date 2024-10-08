import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';
@Injectable({
  providedIn: 'root'
})
export class SessionsService {
 api = inject(SupabaseService);
  constructor() { }

 
}
