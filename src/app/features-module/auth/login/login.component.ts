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
    // const savedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    // if (savedToken) {
    //   if (this.authService.isTokenValid(savedToken)) {
    //     const savedUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    //     this.authService.setLoggedIn(true);
    //     this.router.navigate(['/insurance/dashboard'], { queryParams: { data: savedUserId } });
    //   } else {
    //     localStorage.removeItem('authToken');
    //     sessionStorage.removeItem('authToken');
    //     this.authService.clearSessionStorage();
    //     this.router.navigate(['/login']);
    //   }
    // }

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
        const token = response.token;
        const userId = response.employee.id;
        const encryptedUsername = this.authService.encryptData(response.employee.username);
        const encryptedRole = this.authService.encryptData(response.employee.role);
        const encryptedTeam = this.authService.encryptData(response.employee.team);

        if (userId) {
          if (this.username) {
            localStorage.setItem('rememberedUsername', this.username);
          } else {
            localStorage.removeItem('rememberedUsername');
          }
        }
        
        if (this.rememberMe) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('userId', userId);
        } else {
          sessionStorage.setItem('authToken', token);
          sessionStorage.setItem('userId', userId);
        }

        const encryptedUserId = CryptoJS.AES.encrypt(encryptedUsername, this.authService.encrptSecretKey).toString();
        this.authService.setSessionStorage(response.token, response.employee.username, response.employee.role, response.employee.team, response.employee.id);
        this.authService.setLoggedIn(true);

        const role = this.authService.decryptData(encryptedRole);
        const userData = this.authService.decryptData(encryptedUserId);
        if (role === 'Employee') {
          this.router.navigate(['insurance/dashboard'], { queryParams: { data: userData } });
        }
        else if (role === 'Team Leader') {
          this.router.navigate(['insurance/dashboard'], { queryParams: { data: userData } });
        } 
        else if (role === 'Manager') {
          this.router.navigate(['/manage-leave'], { queryParams: { data: userData } });
        } else {
          this.toastr.error('User role undifine');
        }
      } else {
        this.toastr.error('Login failed, please check your credentials.');
      }
    }, (error: any) => {
      this.toastr.error('Login failed, please try again.');
    });
  }

}

