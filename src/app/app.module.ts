import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './features-module/auth/register/register.component';
import { LoginComponent } from './features-module/auth/login/login.component';
import { DashboardComponent } from './features-module/Insurance/dashboard/dashboard.component';
import { ManageLeaveComponent } from './features-module/Insurance/manage-leave/manage-leave.component';
import { AuthService } from './auth.service';
import { ApplyLeaveComponent } from './features-module/Insurance/apply-leave/apply-leave.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { ProfileSettingComponent } from './features-module/Insurance/profile-setting/profile-setting.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './shared/calendar/calendar.component'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormlyModule } from '../../framework/core/src/lib/core.module';
import { FormlyKendoModule } from '../../framework/ui/kendo/src/lib/ui-kendo.module';
import { InsuranceRoutingModule } from './features-module/Insurance/insurance-routing.module';
import { AuthRoutingModule } from './features-module/auth/auth-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    // RegisterComponent,
    // DashboardComponent,
    // LoginComponent,
    // CalendarComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    InsuranceRoutingModule,
    ToastrModule.forRoot({
      positionClass: "toast-top-center",
      preventDuplicates: true,
      maxOpened: 1,
      autoDismiss: true,
      timeOut: 3000,
    }),
    AppRoutingModule,
    FontAwesomeModule,
    InsuranceRoutingModule,
    AuthRoutingModule,
    HttpClientModule,
    FullCalendarModule,
    // ReactiveFormsModule,
    // FormlyModule,
    // FormlyKendoModule,
    // FormsModule,
    // FormlyModule.forRoot({
    //   validationMessages: [{ name: 'required', message: 'This field is required' }],
    // }),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
