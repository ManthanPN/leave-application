import { Component, OnInit } from '@angular/core';
import { LeaveApplicationServiceService } from '../../../api-service/leave-application-service.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../auth.service';

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
  leaveDays: number;
  roles: string[] = [];
  constructor(
    private authService: AuthService,
    private leaveService: LeaveApplicationServiceService,
    private router: Router
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
      LeaveDays: 26
    };
    
    this.leaveService.Register(user).subscribe(response => {
      this.authService.setSessionStorage(user.Username);
      // console.log('user',user);
      // console.log('respons',response);
      this.router.navigate(['/login']);
    })
  }

  // register(form: NgForm) {
  //   if (form.invalid) {
  //     return;
  //   }
  //   this.leaveService.getUserByUsername(this.username).subscribe(existingUsers => {
  //     if (existingUsers.length > 0) {
  //       alert('Username already exists');
  //     } else {
  //       this.leaveService.getAllUsers().subscribe(users => {
  //         const userId = (users.length + 1).toString();
  //         const user = { id: userId, username: this.username, password: this.password, role: this.role, leaveDays: 26 };
  //         this.leaveService.register(user).subscribe(() => {
  //           this.router.navigate(['/login']);
  //         });
  //       });
  //     }
  //   });
  // }
}

