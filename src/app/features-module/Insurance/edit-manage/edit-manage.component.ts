import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../service/auth.service';
import { LeaveApplicationServiceService } from '../../../api-service/leave-application-service.service';

@Component({
  selector: 'app-edit-manage',
  templateUrl: './edit-manage.component.html',
  styleUrls: ['./edit-manage.component.css']
})
export class EditManageComponent {
  userTeam: string;
  userRole: string;
  leaveApplications: any[] = [];
  uniqueLeaveApplications: any[] = [];
  selectedUsername: string = '';

  constructor(
    private leaveService: LeaveApplicationServiceService,
    private activeModal: NgbActiveModal,
    private authService: AuthService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.userTeam = this.authService.getTeam();
    this.userRole = this.authService.getRole();
    this.loadLeaveApplications();
  }

  isNewUser(username: string): boolean {
    return this.leaveApplications.some(leave => leave.username === username && leave.status === '');
  }

  toggleLeaveDetails(username: string) {
    this.selectedUsername = (this.selectedUsername === username) ? '' : username;
  }

  loadLeaveApplications() {
    this.leaveService.getLeaveApplications().subscribe(applications => {
      this.leaveApplications = applications.filter((app: any) => {
        if (this.userRole === 'Manager') {
          return true;
        }
        if (this.userRole === 'Team Leader' && app.username === this.authService.getUsername()) {
          return false;
        }
        return app.team === this.userTeam;
      });
      this.uniqueLeaveApplications = this.filterUniqueUsernames(this.leaveApplications);
      console.log('Filtered Leave Applications:', this.leaveApplications);
    });
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

  private updateLeaveStatus(id: number, status: string): void {
    const leave = this.leaveApplications.find(leave => leave.id === id);
    if (leave) {
      leave.status = status;
    }
  }

  approveLeave(leaveId: number) {
    const leave = this.leaveApplications.find(app => app.id === leaveId);
    if (leave && leave.team === this.userTeam && this.userRole === 'Team Leader') {
      leave.status = 'approved';
      this.leaveService.approveLeave(leaveId).subscribe(() => {
        this.updateLeaveStatus(leaveId, 'approved');
        this.toastr.success('Leave approved successfully');
      });
    } else {
      this.toastr.error('You can only approve leaves from your team');
    }
  }

  rejectLeave(leaveId: number): void {
    const leave = this.leaveApplications.find(app => app.id === leaveId);
    if (leave && leave.team === this.userTeam && this.userRole === 'Team Leader') {
      leave.status = 'rejected';
      this.leaveService.rejectLeave(leaveId).subscribe(() => {
        this.updateLeaveStatus(leaveId, 'rejected');
        this.toastr.success('Leave approved successfully');
      });
    } else {
      this.toastr.error('You can only reject leaves from your team');
    }
  }

  deleteLeave(leaveId: number): void {
    const leave = this.leaveApplications.find(app => app.id === leaveId);
    if (leave && leave.team === this.userTeam && this.userRole === 'Team Leader') {
      this.leaveService.deleteLeave(leaveId).subscribe(response => {
        this.leaveApplications = this.leaveApplications.filter(leave => leave.id !== leaveId);
        this.uniqueLeaveApplications = this.filterUniqueUsernames(this.leaveApplications);
        this.toastr.success('Leave deleted successfully');
      });
    } else {
      this.toastr.error('You can only delete leaves from your team');
    }
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

  hasPendingLeaves(username: string): boolean {
    return this.leaveApplications.some(leave => leave.username === username && leave.status === 'pending');
  }

  getPendingLeaveCount(username: string): number {
    return this.leaveApplications.filter(leave => leave.username === username && leave.status === 'pending').length;
  }

  closeDialog() {
    this.activeModal.close(false);
  }
}

