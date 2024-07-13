import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AngularWebApp';

  constructor(public authService: AuthService, private router: Router) { }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get canEdit(): boolean {
    return this.authService.hasRole('Editor') || this.authService.hasRole('Admin');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
