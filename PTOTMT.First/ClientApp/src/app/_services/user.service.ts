import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserFromDBEntity } from '../_entities/UserFromDBEntity';
import { UserEntity } from '../_entities/UserEntity';
import { LoginFormData } from '../_viewmodels/LoginFormData';

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

  public login(loginData: LoginFormData): Observable<UserFromDBEntity> {
    const credentials = JSON.stringify(loginData);
    let requestUrl: string = this.userUrl + "/login";
    return this.http.post<UserFromDBEntity>(requestUrl, credentials, httpOptions);
  }

  public getCoWorkers(user: UserFromDBEntity): Observable<any> {

    const paramdata = new HttpParams();
    paramdata.set('teamId', user.teamId)
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

  public getUserById(userId: string): Observable<UserFromDBEntity> {
    let requestUrl: string = this.userUrl + "/" + userId;
    return this.http.get<UserFromDBEntity>(requestUrl, httpOptions)
  }

  public getLeadershipUsers(locationId: string): Observable<UserFromDBEntity[]> {
    let requestUrl: string = this.userUrl + "/leadershipusers/" + locationId;
    return this.http.get<UserFromDBEntity[]>(requestUrl, httpOptions)
  }

  public registerUser(user: UserEntity) {
    const newUser = JSON.stringify(user);
    let response = this.http.post(this.userUrl, newUser, httpOptions);
    response.toPromise().then();
    return response;
  }

  public updateUser(user: UserEntity) {
    const updatedUser = JSON.stringify(user);
    let requestUrl = this.userUrl + "/" + user.id;
    let response = this.http.put(requestUrl, updatedUser, httpOptions);
    response.toPromise().then();
    return response;
  }

  public deleteUser(userId) {
    let requestUrl: string = this.userUrl + "/" + userId;
    return this.http.delete(requestUrl, httpOptions);
  }
}

