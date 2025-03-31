import { Component, OnInit } from '@angular/core';
import { LeaveApplicationServiceService } from '../../../api-service/leave-application-service.service';
import { AuthService } from '../../../service/auth.service';
import { LoadingService } from '../../services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-leave',
  templateUrl: './manage-leave.component.html',
  styleUrls: ['./manage-leave.component.css']
})
export class ManageLeaveComponent implements OnInit {

  leaveApplications: any[] = [];
  uniqueLeaveApplications: any[] = [];
  selectedUsername: string = '';
  leaveData: any[] = [];
  user: any;
  // leaveDurationTime: any[] = [] ;
  constructor(
    private leaveService: LeaveApplicationServiceService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private loadingService: LoadingService,
  ) { }

  ngOnInit(): void {
    this.loadLeaveApplications();
  }

  loadLeaveApplications() {
    const role = this.authService.getRole();
    
    this.leaveService.getLeaveApplications().subscribe(applications => {
      this.leaveApplications = applications;
      this.uniqueLeaveApplications = this.filterUniqueUsernames(applications);
      console.log('leave user', this.leaveApplications);
    });

  }

  logout(): void {
    this.authService.clearSessionStorage();
    this.router.navigate(['/login']);
  }

  filterUniqueUsernames(applications: any[]): any[] {
    const seenUsernames = new Set();
    return applications.filter(leave => {
      if (seenUsernames.has(leave.username)) {
        return false;
      } else {
        seenUsernames.add(leave.username);
        return true;
      }
    });
  }

  isNewUser(username: string): boolean {
    return this.leaveApplications.some(leave => leave.username === username && leave.status === '');
  }

  toggleLeaveDetails(username: string) {
    this.selectedUsername = (this.selectedUsername === username) ? '' : username;
  }

  getTotalLeaveDays(username: string): number {
    return this.leaveApplications.reduce((total, leave) => {
      if (leave.username === username && leave.status === 'approved') {
        return total + this.getLeaveDays(leave.startDate, leave.endDate, leave.leaveDuration);
      }
      return total;
    }, 0);
  }

  getLeaveDays(startDate: string, endDate: string, leaveDuration: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
    if (leaveDuration === 'AM' || leaveDuration === 'PM') {     
      return totalDays * 0.5;
    } else if (leaveDuration === 'Full Day') {
      return totalDays;
    } else {
      return totalDays;
    }
  }

  getLeaveApplications(): void {
    this.leaveService.getLeaveApplications().subscribe(data => {
      this.leaveData = data;
    });
  }

  private updateLeaveStatus(id: number, status: string): void {
    const leave = this.leaveApplications.find(leave => leave.id === id);
    if (leave) {
      leave.status = status;
    }
  }

  approveLeave(id: number): void {
    this.leaveService.approveLeave(id).subscribe(response => {
      this.updateLeaveStatus(id, 'approved');
      this.toastr.success('Leave approved successfully');
      this.loadingService.hideLoading();
    });
  }

  rejectLeave(id: number): void {
    this.loadingService.showLoading();
    this.leaveService.rejectLeave(id).subscribe(response => {
      this.updateLeaveStatus(id, 'rejected');
      this.toastr.success('Leave rejected successfully');
      this.loadingService.hideLoading();
    });
  }

  deleteLeave(id: number): void {
    this.loadingService.showLoading();
    this.leaveService.deleteLeave(id).subscribe(response => {
      this.leaveApplications = this.leaveApplications.filter(leave => leave.id !== id);
      this.uniqueLeaveApplications = this.filterUniqueUsernames(this.leaveApplications);
      this.toastr.success('Leave deleted successfully');
      this.loadingService.hideLoading();
    });
  }

  hasPendingLeaves(username: string): boolean {
    return this.leaveApplications.some(leave => leave.username === username && leave.status === 'pending');
  }

  getPendingLeaveCount(username: string): number {
    return this.leaveApplications.filter(leave => leave.username === username && leave.status === 'pending').length;
  }
}