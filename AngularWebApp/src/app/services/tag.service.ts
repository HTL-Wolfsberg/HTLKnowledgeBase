import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = `${environment.apiUrl}/api/tag`;

  constructor(private http: HttpClient) { }

  getFilters(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}`);
  }
}
