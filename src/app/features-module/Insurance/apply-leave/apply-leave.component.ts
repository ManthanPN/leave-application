import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LeaveApplicationServiceService } from '../../../api-service/leave-application-service.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css']
})
export class ApplyLeaveComponent implements OnInit {
  @Output() leaveApplied = new EventEmitter<any>();
  @Input() selectedStartDate: string = '';
  @Input() selectedEndDate: string = '';

  @ViewChild('leaveForm') leaveForm!: NgForm;

  leaveData: any[] = [];
  types: string[] = [];
  durations: string[] = [];
  id: number;
  username: string = '';
  startDate: string = '';
  endDate: string = '';
  typeLeave: string = '';
  leaveDuration: string = '';
  reason: string = '';
  status: string = 'pending';
  user: string | null = '';
  constructor(
    private leaveService: LeaveApplicationServiceService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private loadingService: LoadingService,
  ) { }

  ngOnChanges() {
    if (this.selectedStartDate && this.selectedEndDate) {
      this.startDate = this.selectedStartDate;
      this.endDate = this.selectedEndDate;
    }
  }

  ngOnInit(): void {
    this.LeaveType();
    this.LeaveDuration();
    this.user = this.authService.getSessionStorage();
  }

  getLeaveApplications(): void {
    this.leaveService.getLeaveApplications().subscribe(data => {
      // console.log(data);
    });
  }

  LeaveType() {
    this.leaveService.getLeaveType().subscribe(type => {
      this.types = type;
    });
  }

  LeaveDuration() {
    this.leaveService.getLeaveDuration().subscribe(duration => {
      this.durations = duration;
    });
  }

  applyLeave() {
    if (this.leaveForm.valid) {
      this.loadingService.showLoading();
      
      let leaveDeduction = 0;
      if (this.leaveDuration === 'AM' || this.leaveDuration === 'PM') {
        leaveDeduction = 0.5;
      } else if (this.leaveDuration === 'Full Day') {
        leaveDeduction = 1;
      }

      const newLeave = {
        startDate: this.startDate,
        endDate: this.endDate,
        typeLeave: this.typeLeave,
        leaveDuration: this.leaveDuration,
        reason: this.reason,
        username: this.user,
        status: this.status
      };

      this.leaveService.addLeave(newLeave).subscribe(response => {
        this.leaveApplied.emit(newLeave);
        this.getLeaveApplications();
        this.leaveForm.resetForm();
        // Reduce the total leave balance based on the leave duration
        this.updateLeaveBalance(leaveDeduction);

        setTimeout(() => {
          this.toastr.success('Leave added successfully');
          this.loadingService.hideLoading();
        }, Math.random() * 1000 + 1000);
      },
        (error: any) => {
          console.error('Error applying leave:', error);
          this.toastr.error('Error applying leave');
          this.loadingService.hideLoading();
        });
    } else {
      console.warn('Form is invalid');
    }
  }

  updateLeaveBalance(deduction: number) {
    const currentBalance = parseFloat(localStorage.getItem('leaveBalance') || '26'); // Assuming 26 is the initial balance
    const newBalance = currentBalance - deduction;
    localStorage.setItem('leaveBalance', newBalance.toString()); // Store the updated leave balance
  }

  resetForm() {
    if (this.leaveForm) {
      this.leaveForm.resetForm();
    }
  }
}
