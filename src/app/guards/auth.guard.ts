import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../services/auth/login.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private authService: LoginService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService._logged_in) {
      this.router.navigate(['/home']);  // Redirect if not logged in
      return false;
    }
    return true;  // Allow access if logged in
  }
}
