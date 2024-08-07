import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.email, this.password).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  loginWithMicrosoft() {
    this.authService.loginWithMicrosoft();
  }
}

