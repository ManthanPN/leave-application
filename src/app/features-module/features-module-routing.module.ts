import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'insurance',
    loadChildren: () => import('./Insurance/insurance.module').then(m => m.InsuranceModule)
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesModuleRoutingModule { }
