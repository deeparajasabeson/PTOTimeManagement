import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestTypeFromDBEntity } from '../_entities/RequestTypeFromDBEntity';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: 'root'
})
export class RequestTypeService {
  // The url of your login route on the server
  requestTypeUrl: string;

  constructor(private http: HttpClient) {
    this.requestTypeUrl = "https://localhost:44382/api/requesttypes";
    }

  public getRequestTypes(): Observable<any> {
    return this.http.get<any>(this.requestTypeUrl, httpOptions);
  }

  public getRequestTypeByName(name: string) {
    let requestUrl: string = this.requestTypeUrl +  "/requesttypebyname/" + name;
    return this.http.get(requestUrl, httpOptions)
  }
} 

