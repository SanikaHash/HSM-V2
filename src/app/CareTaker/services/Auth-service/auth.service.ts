import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userEmailKey = 'userEmail';

  setUserEmail(email: string): void {
    localStorage.setItem(this.userEmailKey, email);
  }

  getUserEmail(): string | null {
    return localStorage.getItem(this.userEmailKey);
  }

  clearUserEmail(): void {
    localStorage.removeItem(this.userEmailKey);
  }

}
