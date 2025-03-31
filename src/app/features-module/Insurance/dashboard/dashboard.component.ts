import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { LeaveApplicationServiceService } from '../../../api-service/leave-application-service.service';
import { AuthService } from '../../../service/auth.service';
import { ApplyLeaveComponent } from '../apply-leave/apply-leave.component';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageLeaveComponent } from '../manage-leave/manage-leave.component';
import { EditManageComponent } from '../edit-manage/edit-manage.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild(ApplyLeaveComponent) applyLeaveComponent!: ApplyLeaveComponent;

  name: string | null = null;
  userRole: string;
  userTeam:string;
  teamleader: any;
  emp:any;
  // user: any;
  uniqueLeaveApplications: any[] = [];
  leaveApplications: any[] = [];
  totalAssignedLeave: number = 26;
  totalApprovedLeave: number = 0;
  totalRejectedLeave: number = 0;
  totalBalancedLeave: number = 26;

  isPendingLeaveModalOpen = false;
  selectedPendingLeave: any | null = null;

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
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    const getUser = this.authService.getId();
    console.log('user', getUser);

    this.route.queryParams.subscribe(params => {
      if (params.data) {
        this.name = this.authService.decryptData(params.data);
      }
    });
    this.user = this.name;
    this.userTeam = this.authService.getTeam();
    this.userRole = this.authService.getRole();
    if (this.userRole === 'Team Leader') {
      this.teamleader = this.userRole;
    } else if (this.userRole === 'Employee') {
      this.emp = this.userRole;
    }
    this.loadLeaveApplications();
    this.updateLeaveBalance();
  }

  loadLeaveApplications() {
    this.leaveService.getLeaveApplications().subscribe((applications: any[]) => {
      this.leaveApplications = applications.filter((data: any) => data.username === this.user)
        .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      console.log('leave app', this.leaveApplications);
      this.uniqueLeaveApplications = this.filterUniqueUsernames(applications);
      this.calculateLeaveStats();
      this.applyFiltersAndSorting();
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

  toggleDropdown() { this.isDropdownOpen = !this.isDropdownOpen; }

  openProfile() { this.isProfileModalOpen = true; }
  closeProfile() { this.isProfileModalOpen = false; }

  openModal() { this.isModalOpen = true; }
  closeModal() {
    this.isModalOpen = false;
    if (this.applyLeaveComponent) {
      this.applyLeaveComponent.resetForm();
    }
  }

  openManage(){
      const modalref = this.modalService.open(EditManageComponent, {
        backdrop: "static",
        backdropClass: "modal-on-modal",
        windowClass: "modal-on-modal-dialog",
        centered: true,
        size: 'lg',
      });
      // modalref.componentInstance.policyId = this.policyId;
      // modalref.componentInstance.dataItem = dataItem;
      // modalref.result.then((data: any) => {
      //   if (data == true) {
      //     this.getQuoteList(this.policyId,true);
      //     this.getQuoteDetail(this.policyId);
      //    this.getPolicyDiaryList(this.policyInitiatorId);
      //   }
      // });
  }

  hasPendingLeaves(username: string): boolean {
    return this.uniqueLeaveApplications.some(leave => leave.username === username && leave.status === 'pending');
  }
  
  getPendingLeaveCount(username: string): number {
    return this.uniqueLeaveApplications.filter(leave => leave.username === username && leave.status === 'pending').length;
  }

  /* LEAVE CANCLE */
  openPendingLeaveModal(leave: any) {
    this.selectedPendingLeave = leave;
    this.isPendingLeaveModalOpen = true;
  }
  closePendingModal() {
    this.isPendingLeaveModalOpen = false;
    this.selectedPendingLeave = null;
  }
  handlePendingLeaveAction(action: string) {
    if (action === 'cancel') {
      this.cancelPendingLeave(this.selectedPendingLeave.id);
    }
    this.selectedPendingLeave = null;
    this.closePendingModal();
  }

  cancelPendingLeave(leaveId: number) {
    this.leaveService.deleteLeave(leaveId).subscribe((d) => {
      console.log('delete', d);
      this.toastr.success('Pending leave request has been canceled.');
      this.leaveApplications = this.leaveApplications.filter((app: any) => app.id !== leaveId);
      this.filteredApplications = this.filteredApplications.filter((app) => app.id !== leaveId);
      this.loadLeaveApplications();
    });
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

  updateLeaveBalance() {
    const savedBalance = parseFloat(localStorage.getItem('leaveBalance') || this.totalAssignedLeave.toString());
    this.totalBalancedLeave = savedBalance;
  }

  //Leave Status 
  getLeaveDays(startDate: string, endDate: string, leaveDuration: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

    if (leaveDuration == 'AM' || leaveDuration == 'PM') {
      return totalDays * 0.5;
    } else if (leaveDuration === 'Full Day') {
      return totalDays;
    } else {
      return totalDays;
    }
  }

  calculateLeaveStats() {
    let approvedLeaves = 0;
    let rejectedLeaves = 0;

    for (const application of this.leaveApplications) {
      if (application.status === 'approved') {
        if (application.leaveDuration === 'AM' || application.leaveDuration === 'PM') {
          approvedLeaves += 0.5;
        } else {
          approvedLeaves += this.getLeaveDays(application.startDate, application.endDate, application.leaveDuration);
        }
      } else if (application.status === 'rejected') {
        rejectedLeaves += this.getLeaveDays(application.startDate, application.endDate, application.leaveDuration);
      }
    }
    this.totalApprovedLeave = approvedLeaves;
    this.totalRejectedLeave = rejectedLeaves;
    this.totalBalancedLeave = this.totalAssignedLeave - approvedLeaves;
  }

  onProfileUpdated(updatedProfile: any) {
    this.user = updatedProfile.username;
    sessionStorage.setItem('user', JSON.stringify(updatedProfile));
    this.loadLeaveApplications();
    this.closeProfile();
  }

}
