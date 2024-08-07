import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsuranceRoutingModule } from './insurance-routing.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormlyModule } from '../../../../framework/core/src/lib/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarComponent } from '../../shared/calendar/calendar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { ProfileSettingComponent } from './profile-setting/profile-setting.component';
import { ManageLeaveComponent } from './manage-leave/manage-leave.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ManageLeaveComponent,
    ApplyLeaveComponent,
    ProfileSettingComponent,
    CalendarComponent
  ],
  imports: [
    CommonModule,
    InsuranceRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    FullCalendarModule
  ]
})
export class InsuranceModule { }
