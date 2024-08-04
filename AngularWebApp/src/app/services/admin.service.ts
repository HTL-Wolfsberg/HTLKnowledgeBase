import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient) { }

  assignRoles(userId: string, roles: string[]): Observable<any> {
    var request: AssignRolesRequest = { roles: roles, userId: userId };
    return this.http.post(`${this.apiUrl}/assign-roles`, request);
  }

  getUserRoles(userId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/get-roles/${userId}`);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-user/${userId}`, { responseType: 'text' });
  }
}

export interface AssignRolesRequest {
  userId: string;
  roles: string[];
}
