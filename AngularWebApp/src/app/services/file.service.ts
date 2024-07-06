import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = `${environment.apiUrl}/api/file`;

  constructor(private http: HttpClient) { }

  uploadFile(file: File, tags: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('tags', tags);

    return this.http.post<any>(this.apiUrl, formData);
  }

  getFiles(tags?: string): Observable<any[]> {
    console.log(this.apiUrl)
    return this.http.get<any[]>(`${this.apiUrl}?tags=${tags}`);
  }

  downloadFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' });
  }

  updateFile(id: number, file: File, tags: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('tags', tags);

    return this.http.put<any>(`${this.apiUrl}/${id}`, formData);
  }
}
