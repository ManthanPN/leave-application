import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { ManageLeaveComponent } from './manage-leave/manage-leave.component';
import { ProfileSettingComponent } from './profile-setting/profile-setting.component';
import { CalendarComponent } from '../../shared/calendar/calendar.component';
import { AuthGuard } from '../../service/auth-guard/auth-guard.service';


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'apply-leave', component: ApplyLeaveComponent, canActivate: [AuthGuard] },
  { path: 'manage-leave', component: ManageLeaveComponent, canActivate: [AuthGuard] },
  { path: 'profile-setting', component: ProfileSettingComponent, canActivate: [AuthGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuranceRoutingModule { }
