import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})

export class LeaveApplicationServiceService {
  // private apiUrl = 'http://localhost:3000/api';
  private apiUrl = 'https://localhost:44370/api/Users'
  private apiLeaveUrl = 'https://localhost:44370/api/Leave'

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  Register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Register`, user);
  }

  Login(objSave: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Login`, objSave);
  }

  sendOTP(email: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/SendOTP`, { Email: email });
  }

  resetPassword(email: string, otp: string, newPassword: string): Observable<any> {
    const body = { email, otp, newPassword };
    return this.http.post<any>(`${this.apiUrl}/ResetPassword`, body);
  }

  getEmployees(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetEmployees`, { headers: this.getHeaders() });
  }

  getRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/roles`, { headers: this.getHeaders() });
  }

  addLeave(leave: any): Observable<any> {
    return this.http.post<any>(`${this.apiLeaveUrl}/AddLeave`, leave);
  }

  getLeaveApplications(): Observable<any> {
    return this.http.get<any>(`${this.apiLeaveUrl}/GetLeaveApplications`, { headers: this.getHeaders() });
  }

  approveLeave(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiLeaveUrl}/ApproveLeave/${id}`, { headers: this.getHeaders() });
  }

  rejectLeave(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiLeaveUrl}/RejectLeave/${id}`, { headers: this.getHeaders() });
  }

  deleteLeave(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiLeaveUrl}/DeleteLeave/${id}`, { headers: this.getHeaders() });
  }

  getLeaveType(): Observable<any> {
    return this.http.get<any>(`${this.apiLeaveUrl}/GetLeaveTypes`, { headers: this.getHeaders() });
  }

  getLeaveDuration(): Observable<any> {
    return this.http.get<any>(`${this.apiLeaveUrl}/GetLeaveDurations`, { headers: this.getHeaders() });
  }

  updateUser(updatedProfile: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/UpdateUser`,
      updatedProfile,
      { headers: this.getHeaders() });
  }
}
