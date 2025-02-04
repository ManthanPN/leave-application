import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})

// export class AuthGuard implements CanActivate {
//   constructor(private authService:AuthService, private router: Router, state: RouterStateSnapshot){};
//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): boolean {
//       const token = sessionStorage.getItem('token');
//       if (this.authService.isLoggedIn || token) {
//         return true;
//       }
//       this.router.navigate(['/login']);
//       return false;
//   }

// }

class IsAuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = sessionStorage.getItem('token');
    if (this.authService.isLogged() || token) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(IsAuthGuard).canActivate(route, state);
};