import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { ManageLeaveComponent } from './manage-leave/manage-leave.component';
import { ProfileSettingComponent } from './profile-setting/profile-setting.component';
import { CalendarComponent } from '../../shared/calendar/calendar.component';

const routes: Routes = [
  // { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'apply-leave', component: ApplyLeaveComponent },
  { path: 'manage-leave', component: ManageLeaveComponent },
  { path: 'profile-setting', component: ProfileSettingComponent },
  { path: 'calendar', component: CalendarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuranceRoutingModule { }
