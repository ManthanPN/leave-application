import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LeaveApplicationServiceService } from '../../../api-service/leave-application-service.service';
import { AuthService } from '../../../auth.service';
import { ApplyLeaveComponent } from '../apply-leave/apply-leave.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild(ApplyLeaveComponent) applyLeaveComponent!: ApplyLeaveComponent;

  // user: any;
  leaveApplications: any[] = [];
  totalAssignedLeave: number = 26;
  totalApprovedLeave: number = 0;
  totalRejectedLeave: number = 0;
  totalBalancedLeave: number = 26;

  isModalOpen = false;
  isLeaveContainerClosed: boolean = false;
  isDropdownOpen = false;
  isProfileModalOpen = false;

  selectedStartDate: string = '';
  selectedEndDate: string = '';

  sortField = 'startDate';
  sortOrder = 'asc';
  selectedStatus = 'all';
  filteredApplications: any[] = [];
  currentFilter = '';
  user: string | null = '';
  constructor(
    private leaveService: LeaveApplicationServiceService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.loadUserData();
    this.loadLeaveApplications();
  }

  loadUserData() {
    this.user = this.authService.getSessionStorage();
    console.log('session user',this.user);
  }

  loadLeaveApplications() {
    this.leaveService.getLeaveApplications().subscribe(applications => {
      this.leaveApplications = applications.filter((app: any) => app.username === this.user)
        .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      console.log('leave app', this.leaveApplications);
      this.calculateLeaveStats();
      this.applyFiltersAndSorting();
    });
  }

  toggleDropdown() { this.isDropdownOpen = !this.isDropdownOpen; }
  // openProfile() { this.isProfileModalOpen = true; }
  // closeProfile() { this.isProfileModalOpen = false; }

  openModal() { this.isModalOpen = true; }
  closeModal() {
    this.isModalOpen = false;
    if (this.applyLeaveComponent) {
      this.applyLeaveComponent.resetForm();
    }
  }

  onLeaveApplied(newLeave: any) {
    this.leaveApplications.push(newLeave);
    this.loadLeaveApplications();
    this.calculateLeaveStats();
    this.closeModal()
  }

  onDateSelected(event: { start: string, end: string }) {
    this.selectedStartDate = event.start;
    this.selectedEndDate = event.end;
    this.openModal();
  }

  toggleLeaveContainer() {
    this.isLeaveContainerClosed = !this.isLeaveContainerClosed;
  }

  applyFiltersAndSorting() {
    this.filterByStatus();
    this.sortApplications();
  }

  filterByStatus() {
    if (this.selectedStatus === 'all') {
      this.filteredApplications = [...this.leaveApplications];
    } else {
      this.filteredApplications = this.leaveApplications.filter(application => application.status === this.selectedStatus);
    }
  }

  sortDate(field: string) {
    this.sortField = field;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFiltersAndSorting();
  }

  sortApplications() {
    this.filteredApplications.sort((a, b) => {
      let comparison = 0;
      if (a[this.sortField] > b[this.sortField]) {
        comparison = 1;
      } else if (a[this.sortField] < b[this.sortField]) {
        comparison = -1;
      }
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  FormatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getLeaveDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
  }

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

  // onProfileUpdated(updatedProfile: any) {
  //   this.user = updatedProfile;
  //   sessionStorage.setItem('user', JSON.stringify(updatedProfile));
  //   this.loadLeaveApplications();
  //   this.closeProfile();
  // }

}
