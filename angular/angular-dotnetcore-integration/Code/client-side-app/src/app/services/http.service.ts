import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpService: HttpClient) { }

  public getData = (route: string) =>{
    return this.httpService.get(route);
  }
}