import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FileModel } from '../file-model';
import { TagModel } from '../tag-model';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = `${environment.apiUrl}/api/file`;

  constructor(private http: HttpClient) { }

  uploadFile(file: File, tags: TagModel[]): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append("tags", JSON.stringify(tags));

    return this.http.post<any>(this.apiUrl, formData);
  }

  getFiles(tags: TagModel[]): Observable<FileModel[]> {
    let params = new HttpParams();
    tags.forEach(tag => params = params.append('tags', tag.name));

    return this.http.get<FileModel[]>(this.apiUrl, { params });
  }

  getFilesFromUser(): Observable<FileModel[]> {
    return this.http.get<FileModel[]>(this.apiUrl + "/getFilesFromUser");
  }

  downloadFile(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' });
  }

  updateFile(id: string, file: File, tags: TagModel[]): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append("tags", JSON.stringify(tags));

    return this.http.put<any>(`${this.apiUrl}/${id}`, formData);
  }

  deleteFile(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
