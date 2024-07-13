import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TagModel } from '../tag-model';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = `${environment.apiUrl}/api/tags`;

  constructor(private http: HttpClient) { }

  getTags(): Observable<TagModel[]> {
    return this.http.get<TagModel[]>(`${this.apiUrl}`);
  }

  addTag(tag: TagModel): Observable<TagModel> {
    tag.id = undefined as unknown as string;
    return this.http.post<TagModel>(this.apiUrl, tag);
  }

  modifyTag(tag: TagModel): Observable<TagModel> {
    return this.http.put<TagModel>(`${this.apiUrl}/${tag.id}`, tag);
  }

  deleteTag(tag: TagModel): Observable<TagModel> {
    return this.http.delete<TagModel>(`${this.apiUrl}/${tag.id}`);
  }

  getTagFileCount(tag: TagModel): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${tag.id}/fileCount`);
  }

}
