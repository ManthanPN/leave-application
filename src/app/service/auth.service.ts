import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { jwtDecode } from 'jwt-decode';

// import * as jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  encrptSecretKey = 'sdjJ5665JsdasdfsasdafdsfdfAFEMOEcmiemMOmc4Ej';

  private isLoggedInStatus: boolean = false;
  redirectUrl: string;

  constructor(private router: Router) {
    this.startTokenCheck();
   }

  isTokenValid(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const expiryTime = decodedToken.exp * 1000;
      return expiryTime > Date.now();
    } catch (error) {
      return false;
    }
  }

  startTokenCheck(): void {
    setInterval(() => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (token && !this.isTokenValid(token)) {
        setTimeout(() => {
          alert('Your session has expired. Please log in again.');
          this.logout();
        }, 500);
       
      }
    }, 30000);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    this.clearSessionStorage();
    this.router.navigate(['/login']);
  }

  encryptData(data: any): any {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.encrptSecretKey).toString();
  }
  
  decryptData(value: string): any {
    const bytes = CryptoJS.AES.decrypt(value, this.encrptSecretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    try {
      return JSON.parse(decryptedText);
    } catch (e) {
      console.error("Error parsing decrypted data:", e);
      return decryptedText;
    }
  }

  setSessionStorage(token: string, username: string, role: string, team: string, id :string): void {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('username', this.encryptData(username));
    sessionStorage.setItem('role', this.encryptData(role));
    sessionStorage.setItem('team', this.encryptData(team));
    sessionStorage.setItem('id', this.encryptData(id));
    this.setLoggedIn(true);
  }


  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getTeam(): string | null {
    const encryptedId =  sessionStorage.getItem('team');
    return encryptedId ? this.decryptData(encryptedId) : null;
  }

  getId(): string | null {
    const encryptedId = sessionStorage.getItem('id');
    return encryptedId ? this.decryptData(encryptedId) : null;
  }

  getUsername(): string | null {
    const encryptedUserId = sessionStorage.getItem('username');
    return encryptedUserId ? this.decryptData(encryptedUserId) : null;
  }

  getRole(): string | null {
    const encryptedRole = sessionStorage.getItem('role');
    return encryptedRole ? this.decryptData(encryptedRole) : null;
  }

  updateUserInfo(username: string, password: string, email?: string, birthdate?: string): void {
    const user = { username, password, email, birthdate };
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  clearSessionStorage(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('user');
    this.setLoggedIn(false);
  }

  setLoggedIn(status: boolean): void {
    this.isLoggedInStatus = status;
  }

  get isLoggedIn(): boolean {
    return this.isLoggedInStatus || !!this.getToken();
  }

  isLogged(): boolean {
    const token = sessionStorage.getItem('token');
    return !!token;
  }

}

