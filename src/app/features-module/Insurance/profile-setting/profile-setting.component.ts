import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LeaveApplicationServiceService } from '../../../api-service/leave-application-service.service';
import { AuthService } from '../../../auth.service';
import { LoadingService } from '../../services/loading.service';
import { FormlyFieldConfig, FormlyFormOptions } from '../../../../../framework/core/src/lib/models';

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.css']
})
export class ProfileSettingComponent implements OnInit {
  @Output() profileUpdated = new EventEmitter<any>();
  userForm: FormGroup;
  user: any = {};
  model: any = {};
  emp : any;
  username: any;
  confirmPassword: any;
  // isLoading = false;

  constructor(
    private authService: AuthService,
    private leaveService: LeaveApplicationServiceService,
    private toastr: ToastrService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.leaveService.getEmployees().subscribe((employees: any[]) => {
      this.emp = employees;
      this.username = this.authService.getSessionStorage();
      const loggedInUser = this.emp.find((emp:any) => emp.username === this.username);
      if (loggedInUser) {
        this.user = loggedInUser;
        this.setForm();
      } else {
        this.toastr.error('User not found');
      }
    });
    this.setForm();
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
    if (this.userForm.valid) {
      this.loadingService.showLoading();

      if (this.userForm.value.password !== this.userForm.value.confirmPassword) {
        this.toastr.error('Passwords do not match');
        return;
      }

      const updatedProfile = {
        id: this.user.id,
        username: this.user.username,
        password: this.userForm.value.password,
        email: this.userForm.value.email,
        birthdate: this.userForm.value.birthdate
      };

      this.leaveService.updateUser(updatedProfile).subscribe(
      (data: any) => {
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



