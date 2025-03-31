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
  id: string;
  username: string = '';
  password: string = '';
  role: string = '';
  leaveDays: number = 26;
  roles: string[] = [];
  email: string = '';
  birthdate: string = '';

  teams: string[] = [];
  selectedTeam: string = '';

  constructor(
    private authService: AuthService,
    private leaveService: LeaveApplicationServiceService,
    private router: Router,
    private toastr: ToastrService 
  ) { }

  ngOnInit(): void {
    this.getRoles();
    this.getTeams(); 
  }

  getRoles() {
    this.leaveService.getRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  getTeams() {
    this.leaveService.getTeams().subscribe(teams => {
      this.teams = teams;
    });
  };

  onRoleChange(event: any) {
    this.role = event.target.value;
    if (this.role === 'Employee' || 'Team Leader') {
      this.selectedTeam = ''; 
    }
  }

  Register(): void {
    const user = {
      Username: this.username,
      Password: this.password,
      Role: this.role,
      Team: this.role === 'Employee' || 'Team Leader' ? this.selectedTeam : null,
      LeaveDays: this.leaveDays,
      Email: this.email,
      Birthdate: this.birthdate
    };
    this.leaveService.getEmployees().subscribe((data: any) => {
      const usernameExists = data.employees.some((emp:any) => emp.username === user.Username);
      if (usernameExists) {
        this.toastr.error('Username already exists.');
        return;
      } 
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

