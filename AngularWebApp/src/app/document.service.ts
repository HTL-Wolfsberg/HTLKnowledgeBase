import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private url = this.apiService.getApiAddress() + "Document/";

  constructor(private http: HttpClient,
    private apiService: ApiService) { }

  postDocument(formData: FormData): Observable<null> {
    return this.http.post<null>( this.url + "", formData);
  }

  Get(): Observable<Document[]> {
    return this.http.get<Document[]>( this.url + "");
  }
}
