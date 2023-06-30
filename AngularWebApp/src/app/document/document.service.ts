import { HttpClient, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { Document } from './document.model';
import { Tag } from './Tag';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private url = this.apiService.getApiAddress() + "Document/";

  constructor(private http: HttpClient,
    private apiService: ApiService) { }

  post(formData: FormData): Observable<string> {
    return this.http.post<string>(this.url + "Post", formData);
  }

  postDocumentTags(tags: Tag[], guid: string): Observable<null> {
    let tagsWithGuid:TagsWithGuid = {
      tags: tags,
      guid: guid
    }
    return this.http.post<null>(this.url + "PostDocumentTags", tagsWithGuid);
  }



  Get(guid: string): Observable<HttpResponse<Blob>> {
    return this.http.get(this.url + "Get/" + guid , { observe: 'response', responseType: 'blob', reportProgress: true });
  }

  GetOnlyMetaData(): Observable<Document[]> {
    return this.http.get<Document[]>(this.url + "/Get");
  }
}

interface TagsWithGuid{
  tags:Tag[];
  guid:string;
}