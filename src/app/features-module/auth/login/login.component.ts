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
  email: string = '';
  birthdate: string = '';

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
// login(form: NgForm) {
//   if (form.invalid) {
//     return;
//   }

//   const objSave = {
//     username: this.username,
//     password: this.password
//   };

//   this.leaveService.Login(objSave).subscribe(response => {
//     if (response === "Success") {
//       this.leaveService.GetAllUsers().subscribe(users => {
//         const user = users[0];
//         this.email = user.email;
//         this.birthdate = user.birthdate;
//         this.authService.login(user.role, this.username, this.password, user.id, this.email, this.birthdate);
//         if (user.role === 'manager') {
//           this.router.navigate(['/manage-leave']);
//         } else {
//           this.router.navigate(['insurance/dashboard']);
//         }
//       });
//     } else {
//       this.toastr.error('Invalid credentials');
//     }
//   });
// }
