import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LeaveApplicationServiceService {
  // private apiUrl = 'http://localhost:3000/api';
  private apiUrl = 'https://localhost:44370/api/Users'
  private apiLeaveUrl = 'https://localhost:44370/api/Leave'

  constructor(private http: HttpClient) { }

  Register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Register`, user);
  }

  Login(objSave: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Login`, objSave);
  }

  // setSessionStorage(username: string): void {
  //   sessionStorage.setItem('username', username);
  // }

  // getSessionStorage(): string | null {
  //   return sessionStorage.getItem('username');
  // }

  // clearSessionStorage(): void {
  //   sessionStorage.removeItem('username');
  // }

  getEmployees(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetEmployees`);
  }

  getRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/roles`);
  }

  addLeave(leave: any): Observable<any> {
    return this.http.post<any>(`${this.apiLeaveUrl}/AddLeave`, leave);
  }

  getLeaveApplications(): Observable<any> {
    return this.http.get<any>(`${this.apiLeaveUrl}/GetLeaveApplications`);
  }

  approveLeave(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiLeaveUrl}/ApproveLeave/${id}`, {});
  }

  rejectLeave(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiLeaveUrl}/RejectLeave/${id}`, {});
  }

  deleteLeave(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiLeaveUrl}/DeleteLeave/${id}`);
  }

  getLeaveType(): Observable<any> {
    return this.http.get<any>(`${this.apiLeaveUrl}/GetLeaveTypes`);
  }

  getLeaveDuration(): Observable<any> {
    return this.http.get<any>(`${this.apiLeaveUrl}/GetLeaveDurations`);
  }

  // applyLeave(leave: any): Observable<any> {
  //   return this.http.post<any>(`${this.apiLeaveUrl}/LeaveManage`, leave);
  // }

  // getLeaveApplications(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiLeaveUrl}/GetLeaveApplications`);
  // }

  // approveLeave(applicationId: number): Observable<any> {
  //   return this.http.patch<any>(`${this.apiLeaveUrl}/ApproveLeave/${applicationId}`, {});
  // }

  // rejectLeave(applicationId: number): Observable<any> {
  //   return this.http.patch<any>(`${this.apiLeaveUrl}/RejectLeave/${applicationId}`, {});
  // }

  // deleteLeave(applicationId: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiLeaveUrl}/DeleteLeave/${applicationId}`);
  // }

  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateUser/${user.id}`, user);
  }
}
