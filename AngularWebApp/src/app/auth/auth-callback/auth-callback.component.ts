import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss'
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const refreshToken = params['refreshToken'];

      if (token && refreshToken) {
        this.authService.setSession(token, refreshToken);
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
