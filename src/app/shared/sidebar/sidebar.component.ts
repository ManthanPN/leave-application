import { Component, Input } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { LeaveApplicationServiceService } from '../../api-service/leave-application-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isOpen: boolean = false;

  user: any;
  leaveApplications: any[] = [];
  totalAssignedLeave: number = 26;
  totalApprovedLeave: number = 0;
  totalRejectedLeave: number = 0;
  totalBalancedLeave: number = 26;

  isModalOpen = false;

  constructor(
    private leaveService: LeaveApplicationServiceService,
    private authService: AuthService
  ) { }

  // ngOnInit() {
  //   this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
  //   this.leaveService.getLeaveApplications().subscribe(applications => {
  //     this.leaveApplications = applications.filter((app: any) => app.username === this.user.username);
  //     this.calculateLeaveStats();
  //   });
  // }

  calculateLeaveStats() {
    let approvedLeaves = 0;
    let rejectedLeaves = 0;
    for (const application of this.leaveApplications) {
      const startDate = new Date(application.startDate);
      const endDate = new Date(application.endDate);
      const leaveDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;

      if (application.status === 'approved') {
        approvedLeaves += leaveDays;
      } else if (application.status === 'rejected') {
        rejectedLeaves += leaveDays;
      }
    }
    this.totalApprovedLeave = approvedLeaves;
    this.totalRejectedLeave = rejectedLeaves;
    this.totalBalancedLeave = this.totalAssignedLeave - approvedLeaves;
  }

}
