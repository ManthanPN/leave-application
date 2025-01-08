import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private isLoggedInStatus: boolean = false;

  constructor() { }

  // Store only username initially
  setSessionStorage(username: string): void {
    sessionStorage.setItem('username', username);
    this.setLoggedIn(true);
  }

  // Get the username from session storage
  getSessionStorage(): string | null {
    return sessionStorage.getItem('username');
  }

  updateUserInfo(username: string, password: string, email?: string, birthdate?: string): void {
    const user = { username, password, email, birthdate };
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  // Get the full user object from session storage
  getUserInfo(): any {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Clear session storage
  clearSessionStorage(): void {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('user');
    this.setLoggedIn(false);
  }

  setLoggedIn(status: boolean): void {
    this.isLoggedInStatus = status;
  }

  get isLoggedIn(): boolean {
    return this.isLoggedInStatus || !!this.getSessionStorage();
  }
}