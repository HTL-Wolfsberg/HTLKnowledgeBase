import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  name: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    this.authService.register(this.email, this.password, this.name).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

}
