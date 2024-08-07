import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private isLoggedInStatus: boolean = false;

  constructor() { }

  setSessionStorage(username: string): void {
    sessionStorage.setItem('username', username);
    this.setLoggedIn(true);
  }

  getSessionStorage(): string | null {
    return sessionStorage.getItem('username');
  }

  clearSessionStorage(): void {
    sessionStorage.removeItem('username');
    this.setLoggedIn(false);
  }

  setLoggedIn(status: boolean): void {
    this.isLoggedInStatus = status;
  }

  get isLoggedIn(): boolean {
    return this.isLoggedInStatus || !!this.getSessionStorage();
  }
}

 // private loggedIn: boolean;
  // private id: string;
  // private userRole: string;
  // private username: string;
  // private password: string;
  // private email: string;
  // private birthdate: string;

  // constructor() {
  //   const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  //   this.loggedIn = !!user.username;
  //   this.userRole = user.role || '';
  //   this.username = user.username || '';
  //   this.password = user.password || '';
  //   this.email = user.email || '';
  //   this.birthdate = user.birthdate || '';
  //   this.id = user.id || '';
  // }

  // login(userRole: string, username: string, password: string, id: string, email: string, birthdate: string): void {
  //   this.loggedIn = true;
  //   this.userRole = userRole;
  //   this.username = username;
  //   this.password = password;
  //   this.birthdate = birthdate;
  //   this.email = email;
  //   this.id = id;
  //   sessionStorage.setItem('user', JSON.stringify({ username, password, email, birthdate, role: userRole, id }));
  // }

  // logout(): void {
  //   this.loggedIn = false;
  //   this.userRole = '';
  //   this.username = '';
  //   this.password = '';
  //   this.email = '';
  //   this.birthdate = '';
  //   this.id = '';
  //   sessionStorage.removeItem('user');
  // }

  // isLoggedIn(): boolean {
  //   return this.loggedIn;
  // }

  // getUserRole(): string {
  //   return this.userRole;
  // }

  // getUsername(): string {
  //   return this.username;
  // }

  // getPassword(): string {
  //   return this.password;
  // }

  // getEmail() {
  //   return this.email;
  // }

  // getBirthdate() {
  //   return this.birthdate;
  // }

  // getUserId(): string {
  //   return this.id;
  // }

  // updateUserInfo(username: string, password: string, email: string, birthdate: string): void {
  //   this.username = username;
  //   this.password = password;
  //   this.email = email;
  //   this.birthdate = birthdate;
  //   const user = { username, password, email, birthdate, role: this.userRole, id: this.id };
  //   sessionStorage.setItem('user', JSON.stringify(user));
  // }