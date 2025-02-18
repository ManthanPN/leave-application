import { Component, OnInit } from '@angular/core';
import { LeaveApplicationServiceService } from '../../../api-service/leave-application-service.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;

  email: string = '';
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showForgotPassword: boolean = false;
  showOTPForm: boolean = false;

  constructor(
    private leaveService: LeaveApplicationServiceService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      this.username = savedUsername;
      this.rememberMe = true;
    }
  }

  openForgotPasswordModal(): void {
    this.showForgotPassword = true;
    this.showOTPForm = false;
  }

  sendOTP(): void {
    if (!this.email) {
      this.toastr.error('Please enter a valid email');
      return;
    }

    this.leaveService.sendOTP(this.email).subscribe(
      () => {
        this.showOTPForm = true;
        this.toastr.success('OTP sent to your email.');
      },
      (error) => {
        this.toastr.error('Failed to send OTP. Please try again.');
      }
    );
  }

  resetPassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.toastr.error('Passwords do not match.');
      return;
    }

    this.leaveService.resetPassword(this.email, this.otp, this.newPassword).subscribe(
      () => {
        this.toastr.success('Password reset successfully. Please log in.');
        this.router.navigate(['/login']);
      },
      (error) => {
        this.toastr.error('Failed to reset password. Please check the OTP and try again.');
      }
    );
  }

  Login(): void {
    const credentials = {
      Username: this.username,
      Password: this.password,
    };

    this.leaveService.Login(credentials).subscribe(response => {
      if (response && response.token) {
        if(response.employee.id){
          if (this.rememberMe) {
            localStorage.setItem('rememberedUsername', this.username);
          } else {
            localStorage.removeItem('rememberedUsername');
          } 
        }    
        const encryptedUsername = this.authService.encryptData(response.employee.username);
        const encryptedRole = this.authService.encryptData(response.employee.role);
        this.authService.setSessionStorage(response.token, response.employee.username, response.employee.role, response.employee.id);
        const encryptedUserId = CryptoJS.AES.encrypt(encryptedUsername, this.authService.encrptSecretKey).toString();
        this.authService.setLoggedIn(true);

        const role = this.authService.decryptData(encryptedRole);
        const userId = this.authService.decryptData(encryptedUserId);
        if (role === 'Employee') {
          this.router.navigate(['insurance/dashboard'], { queryParams: { data: userId } });
        } else if (role === 'Manager') {
          this.router.navigate(['/manage-leave'], { queryParams: { data: userId }});
        } else {
          this.toastr.error('User role undifine');
        }
      } else {
        this.toastr.error('Login failed, please check your credentials.');
      }
    }, error => {
      this.toastr.error('Login failed, please try again.');
    });
  }

}

