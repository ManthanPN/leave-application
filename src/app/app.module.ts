import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './service/auth.service';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InsuranceRoutingModule } from './features-module/Insurance/insurance-routing.module';
import { AuthRoutingModule } from './features-module/auth/auth-routing.module';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './service/auth-interceptor/auth-interceptor.service';
@NgModule({
  declarations: [
    AppComponent,
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
  ],
  providers: [AuthService,  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
