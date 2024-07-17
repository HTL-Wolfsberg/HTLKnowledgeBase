import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const roles = route.data['roles'] as Array<string>;
    if (this.authService.isAuthenticated()) {
      if (roles) {
        const hasRole = roles.some(role => this.authService.hasRole(role));
        if (hasRole) {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      }
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
