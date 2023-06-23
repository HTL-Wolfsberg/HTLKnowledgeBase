import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  url = this.apiService.getApiAddress() + "";

  constructor(private http: HttpClient,
    private apiService: ApiService) { }

  postDocument(formData: FormData): Observable<null> {
    return this.http.post<null>( this.url + "WeatherForecast", formData);

  }

  getShit(): Observable<null> {
    return this.http.get<null>( this.url + "WeatherForecast");

  }
}
