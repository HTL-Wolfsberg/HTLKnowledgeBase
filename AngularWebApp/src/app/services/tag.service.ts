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

  getTags(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}`);
  }

  addTag(tag: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tag);
  }

  modifyTag(tagId: number, tag: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${tagId}`, tag);
  }

  deleteTag(tagId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${tagId}`);
  }
}
