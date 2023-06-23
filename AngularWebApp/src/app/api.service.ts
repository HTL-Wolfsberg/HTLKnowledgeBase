import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  public getApiAddress(){
    if (isDevMode())
    {
      return this.apiAddressLocal;
    }
    else
    {
      return this.apiAddressOnline;
    }
  }

  private apiAddressLocal = "http://127.0.0.1:5244/";
  private apiAddressOnline = "https://127.0.0.1:7095/";

}
