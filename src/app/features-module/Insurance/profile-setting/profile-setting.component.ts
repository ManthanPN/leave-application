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
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[];
  model: any = {};
  // myForm = new FormGroup({});
  user: any;
  userForm: FormGroup;
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
    // this.user = {
    //   id: this.authService.getUserId(),
    //   username: this.authService.getUsername(),
    //   password: this.authService.getPassword(),
    //   email: this.authService.getEmail(),
    //   birthdate: this.authService.getBirthdate()
    // };
    // this.setForm();
  }

  onSubmit() { }

  updateProfile(profileForm: NgForm): void {
    if (profileForm.valid) {
      if (this.user.password !== this.confirmPassword) {
        this.toastr.error('Password and confirm password do not match');
        return;
      }
      this.loadingService.showLoading();
      const updatedProfile = {
        id: this.user.id,
        username: this.user.username,
        password: this.user.password,
        email: this.user.email,
        birthdate: this.user.birthdate
      };
      // this.leaveService.updateUser(updatedProfile).subscribe(
      //   (response: any) => {
      //     sessionStorage.setItem('user', JSON.stringify(updatedProfile));
      //     this.authService.updateUserInfo(updatedProfile.username, updatedProfile.password, updatedProfile.email, updatedProfile.birthdate);
      //     this.profileUpdated.emit(updatedProfile);
      //     setTimeout(() => {
      //       this.loadingService.hideLoading();
      //       this.toastr.success('Profile updated successfully');
      //     }, Math.random() * 1000 + 1000);
      //   },
      //   (error: any) => {
      //     this.toastr.error('Error updating profile');
      //     this.loadingService.hideLoading();
      //   }
      // );
    }
  }

  setForm() {
    // this.userForm = this.fb.group({
    //   username: [{ value: this.user.username, disabled: true }, Validators.required],
    //   birthdate: [this.user.birthdate, Validators.required],
    //   password: [this.user.password, Validators.required],
    //   confirmPassword: ['', Validators.required],
    //   email: [this.user.email, [Validators.required, Validators.email]]
    // });
    this.fields = [
      
      {
        fieldGroupClassName: 'row my-2',
        fieldGroup: [
          {
            className: 'col-sm-6',
            type: 'input',
            key: 'username',
            props: {
              label: 'Username',
            },
          },
          {
            className: 'col-sm-6',
            key: 'birthdate',
            type: 'date',
            props: {
              label: 'Birthdate',
              primitive: true,
              required: true,
              format: 'dd/MM/yyyy',
            },
          },
        ],
      },
      {
        fieldGroupClassName: 'row my-2',
        fieldGroup: [
          {
            className: 'col-sm-6',
            type: 'input',
            key: 'password',
            props: {
              label: 'Password',
            },
          },
          {
            className: 'col-sm-6',
            type: 'input',
            key: 'confirmPassword',
            props: {
              label: 'Confirm Password',
            },
          },
        ],
      },
      {
        fieldGroupClassName: 'row my-2',
        fieldGroup: [
          {
            className: 'col-sm-12',
            type: 'email',
            key: 'email',
            props: {
              label: 'Email',
            },
          },
        ],
      },
    ];
  }
  // onSubmit() {
  //   if (this.userForm.valid) {
  //     const formValues = this.userForm.getRawValue();
  //     if (formValues.password !== this.userForm.value.confirmPassword) {
  //       this.toastr.error('Password and confirm password do not match');
  //       return;
  //     }

  //     this.loadingService.showLoading();
  //     const updatedProfile = {
  //       id: this.user.id,
  //       username: formValues.username,
  //       password: formValues.password,
  //       email: formValues.email,
  //       birthdate: formValues.birthdate
  //     };

  //     this.leaveService.updateUser(updatedProfile).subscribe(
  //       (response: any) => {
  //         sessionStorage.setItem('user', JSON.stringify(updatedProfile));
  //         this.authService.updateUserInfo(updatedProfile.username, updatedProfile.password, updatedProfile.email, updatedProfile.birthdate);
  //         this.profileUpdated.emit(updatedProfile);
  //         setTimeout(() => {
  //           this.loadingService.hideLoading();
  //           this.toastr.success('Profile updated successfully');
  //         }, Math.random() * 1000 + 1000);
  //       },
  //       (error: any) => {
  //         this.toastr.error('Error updating profile');
  //         this.loadingService.hideLoading();
  //       }
  //     );
  //   }
  // }
  
}
