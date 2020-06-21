import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserFromDBEntity } from '../_entities/UserFromDBEntity';
import { Observable } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // The url of your login route on the server
  userUrl: string;


  constructor(private http: HttpClient) {
    this.userUrl = "https://localhost:44382/api/users";
  }

  public getCoWorkers(user: UserFromDBEntity): Observable<any> {

    const paramdata = new HttpParams();
    paramdata.set('teamId', user.teamFunctionId)
    paramdata.set('locationId', user.locationId);

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
      params: paramdata
    };

    let requestUrl: string = this.userUrl + "/coworkers/";
    return this.http.get<any>(requestUrl, httpOptions);
  }
}

