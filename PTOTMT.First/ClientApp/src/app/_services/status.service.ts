import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StatusFromDBEntity } from '../_entities/StatusFromDBEntity';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  // The url of your login route on the server
  statusUrl: string;

  constructor(private http: HttpClient) {
    this.statusUrl = "https://localhost:44382/api/statuses";
    }

  public getStatusById(statusId: string) {
    let requestUrl: string = this.statusUrl + "/" + statusId;
    return this.http.get<any>(requestUrl, httpOptions);
  }

  public getStatusByName(statusName: string) {
    let requestUrl: string = this.statusUrl + "?statusName=" + statusName;
    return this.http.get(this.statusUrl, httpOptions)
  }

  public getStatuses(): Observable<StatusFromDBEntity[]>{
    return this.http.get<StatusFromDBEntity[]>(this.statusUrl, httpOptions);
  }
} 

