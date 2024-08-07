import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './features-module/auth/register/register.component';
import { LoginComponent } from './features-module/auth/login/login.component';
import { ManageLeaveComponent } from './features-module/Insurance/manage-leave/manage-leave.component';
import { DashboardComponent } from './features-module/Insurance/dashboard/dashboard.component';
import { ApplyLeaveComponent } from './features-module/Insurance/apply-leave/apply-leave.component';
import { CalendarComponent } from './shared/calendar/calendar.component';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features-module/features-module.module').then(m => m.FeaturesModuleModule)
  },
  { path: '', redirectTo: '/features-module/auth/login/login', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
