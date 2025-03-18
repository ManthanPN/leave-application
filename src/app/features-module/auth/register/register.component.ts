import { Component, OnInit } from '@angular/core';
import { LeaveApplicationServiceService } from '../../../api-service/leave-application-service.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { LoginComponent } from '../login/login.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  id: number;
  username: string = '';
  password: string = '';
  role: string = '';
  leaveDays: number = 26;
  roles: string[] = [];
  email: string = '';
  birthdate: string = '';
  constructor(
    private authService: AuthService,
    private leaveService: LeaveApplicationServiceService,
    private router: Router,
    private toastr: ToastrService 
  ) { }

  ngOnInit(): void {
    this.leaveService.getRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  Register(): void {
    const user = {
      Username: this.username,
      Password: this.password,
      Role: this.role,
      LeaveDays: this.leaveDays,
      Email: this.email,
      Birthdate: this.birthdate
    };
    this.leaveService.getEmployees().subscribe((employees: any[]) => {
      // const usernameExists = employees.some(emp => emp.username === user.Username);
      // if (usernameExists) {
      //   this.toastr.error('Username already exists.');
      //   return;
      // } 
      this.leaveService.Register(user).subscribe(response => {
        if (response) {
          localStorage.setItem('rememberedUsername', user.Username);
          this.router.navigate(['/login']);
          this.toastr.success('Registration Successful');
        } else {
          this.toastr.error('Registration failed. Please try again.');
        }
      });
    });
  } 

}

