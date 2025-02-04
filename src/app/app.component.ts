import { Component, OnInit } from '@angular/core';
import { LeaveApplicationServiceService } from './api-service/leave-application-service.service';
import { Location } from '@angular/common';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from './features-module/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isSideNavOpen = false;
  isLoading = false;
  title = 'leave-application';

  constructor(
    public authService: AuthService,
    private loadingService: LoadingService,
    private router : Router
  ) { }

  ngOnInit() {
    this.loadingService.loadingStatus.subscribe((status: boolean) => {
      this.isLoading = status;
    });
  }

  logout(): void {
    this.authService.clearSessionStorage();
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return this.authService.isLogged();
  }

  toggleSideNav() {
    this.isSideNavOpen = !this.isSideNavOpen;
  }
}
