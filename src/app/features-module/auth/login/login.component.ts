import { Component, OnInit } from '@angular/core';
import { LeaveApplicationServiceService } from '../../../api-service/leave-application-service.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  // email: string = '';
  // birthdate: string = '';

  constructor(
    private leaveService: LeaveApplicationServiceService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {}

  Login(): void {
    const credentials = {
      Username: this.username,
      Password: this.password,
    };

    this.leaveService.Login(credentials).subscribe(response => {
      if (response) {
        this.authService.setSessionStorage(credentials.Username);
        this.authService.setLoggedIn(true);
        if (response.role === 'Employee') {
          this.router.navigate(['insurance/dashboard']);
        } else {
          this.router.navigate(['/manage-leave']);
        }
      } else {
        this.toastr.error('Login failed, please check your credentials.');
      }
    })
  }

}

