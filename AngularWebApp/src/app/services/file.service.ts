import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FileModel } from '../file-model';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = `${environment.apiUrl}/api/file`;

  constructor(private http: HttpClient) { }

  uploadFile(file: File, tags: string[]): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const params = new HttpParams().set('tags', tags.join(','));

    return this.http.post<any>(this.apiUrl, formData, { params });
  }

  getFiles(tags: string[]): Observable<FileModel[]> {
    let params = new HttpParams();
    tags.forEach(tag => params = params.append('tags', tag));

    return this.http.get<FileModel[]>(this.apiUrl, { params });
  }

  getFilesFromUser(): Observable<FileModel[]> {
    return this.http.get<FileModel[]>(this.apiUrl + "/getFilesFromUser");
  }

  downloadFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' });
  }

  updateFile(id: number, file: File, tags: string[]): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    tags.forEach(tag => formData.append('tags', tag));

    return this.http.put<any>(`${this.apiUrl}/${id}`, formData);
  }
}
