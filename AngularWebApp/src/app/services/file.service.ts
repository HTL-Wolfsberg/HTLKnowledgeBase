import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { FileModelImpl } from '../file-model';
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

  getFiles(tags: TagModel[]): Observable<FileModelImpl[]> {
    let params = new HttpParams();
    tags.forEach(tag => params = params.append('tags', tag.name));

    return this.http.get<FileModelImpl[]>(this.apiUrl, { params }).pipe(
      map(files => files.map(file => new FileModelImpl(file)))
    );
  }

  getFilesFromUser(): Observable<FileModelImpl[]> {
    return this.http.get<FileModelImpl[]>(this.apiUrl + "/getFilesFromUser").pipe(
      map(files => files.map(file => new FileModelImpl(file)))
    );
  }

  downloadFile(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' });
  }

  updateFile(file: FileModelImpl): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${file.id}`, file);
  }

  deleteFile(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
