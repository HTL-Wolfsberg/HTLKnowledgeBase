import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { jwtDecode } from 'jwt-decode';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/authentication`;
  private encryptionKey = CryptoJS.enc.Utf8.parse(environment.encryptionKey); // Ensure this is 32 bytes for AES-256
  private iv = CryptoJS.enc.Utf8.parse(environment.encryptionIv); // Ensure this is 16 bytes for AES

  constructor(private http: HttpClient, private router: Router) { }

  register(email: string, password: string, name: string): Observable<any> {
    const encryptedPassword = this.encryptPassword(password);
    return this.http.post<any>(`${this.apiUrl}/register`, { email, password: encryptedPassword, name });
  }

  login(email: string, password: string): Observable<any> {
    const encryptedPassword = this.encryptPassword(password);
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password: encryptedPassword }).pipe(
      map(response => {
        this.setSession(response.token, response.refreshToken);
        return response;
      })
    );
  }

  loginWithGoogle() {
    window.location.href = `${this.apiUrl}/login-google`;
  }

  loginWithMicrosoft() {
    window.location.href = `${this.apiUrl}/login-microsoft`;
  }

  setSession(token: string, refreshToken: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private encryptPassword(password: string): string {
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(password), this.encryptionKey, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      map(response => {
        this.setSession(response.token, response.refreshToken);
        return response;
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const decodedToken: any = jwtDecode(token);
    const jwtRole = decodedToken['role'];
    return jwtRole && jwtRole.includes(role);
  }

  private isTokenExpired(token: string): boolean {
    const decodedToken: any = jwtDecode(token);
    const expirationTime = decodedToken.exp * 1000;
    return Date.now() >= expirationTime;
  }

  isAccessTokenExpired(): boolean {
    const token = this.getToken();
    return token ? this.isTokenExpired(token) : true;
  }

  isRefreshTokenExpired(): boolean {
    const refreshToken = this.getRefreshToken();
    return refreshToken ? this.isTokenExpired(refreshToken) : true;
  }
}
