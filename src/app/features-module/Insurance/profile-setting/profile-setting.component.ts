import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LeaveApplicationServiceService } from '../../../api-service/leave-application-service.service';
import { LoadingService } from '../../services/loading.service';
import { AuthService } from '../../../service/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.css']
})
export class ProfileSettingComponent implements OnInit {
  @Output() profileUpdated = new EventEmitter<any>();
  userForm: FormGroup;
  user: any;
  emp: any;
  confirmPassword: any;
  id: any;

  constructor(
    private authService: AuthService,
    private leaveService: LeaveApplicationServiceService,
    private toastr: ToastrService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.id = this.authService.getId();
    this.loadLeaveApplications();
  }

  loadLeaveApplications() {
    this.leaveService.getEmployees().subscribe((response:any) => {
      this.emp = response?.employees.filter((data: any) => data.id === this.id) 
      if (this.emp) {
        this.user = this.emp[0];
        this.setForm();
      } else {
        this.toastr.error('User not found');
      }
    });
  }

  setForm() {
    this.userForm = this.fb.group({
      username: [this.user.username, Validators.required],
      birthdate: [this.user.birthdate, Validators.required],
      password: [this.user.password, Validators.required],
      confirmPassword: ['', Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.userForm.valid){
      this.loadingService.showLoading();

      if (this.userForm.value.password !== this.userForm.value.confirmPassword) {
        this.toastr.error('Passwords do not match');
        return;
      }

      const updatedProfile = {
        id: this.id,
        username: this.userForm.value.username,
        password: this.userForm.value.password,
        email: this.userForm.value.email,
        birthdate: this.userForm.value.birthdate
      };

      this.leaveService.updateUser(updatedProfile).subscribe(() => {
          sessionStorage.setItem('user', JSON.stringify(updatedProfile));
          this.authService.updateUserInfo(updatedProfile.username, updatedProfile.password, updatedProfile.email, updatedProfile.birthdate);
          this.profileUpdated.emit(updatedProfile);
          setTimeout(() => {
            this.loadingService.hideLoading();
            this.toastr.success('Profile updated successfully');
          }, Math.random() * 1000 + 1000);
        },
        (error: any) => {
          this.toastr.error('Error updating profile');
          this.loadingService.hideLoading();
        }
      );
    }
  }
}



