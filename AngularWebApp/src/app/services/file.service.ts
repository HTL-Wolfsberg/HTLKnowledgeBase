import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { FileModel, FileModelImpl } from '../file-model';
import { TagModel } from '../tag-model';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = `${environment.apiUrl}/api/file`;

  constructor(private http: HttpClient) { }

  uploadFile(file: File, tags: TagModel[]): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append("tags", JSON.stringify(tags));

    return this.http.post<any>(this.apiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getFiles(tags: TagModel[]): Observable<FileModel[]> {
    let params = new HttpParams();
    tags.forEach(tag => params = params.append('tags', tag.name));

    return this.http.get<FileModel[]>(this.apiUrl, { params }).pipe(
      map(files => files.map(file => new FileModelImpl(file)))
    );
  }

  getFilesFromUser(): Observable<FileModel[]> {
    return this.http.get<FileModel[]>(this.apiUrl + "/getFilesFromUser").pipe(
      map(files => files.map(file => new FileModelImpl(file)))
    );
  }

  downloadFile(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' });
  }

  updateFile(file: FileModel): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${file.id}`, file);
  }

  deleteFile(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
