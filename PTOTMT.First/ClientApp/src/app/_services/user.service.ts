import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserFromDBEntity } from '../_entities/UserFromDBEntity';
import { UserEntity } from '../_entities/UserEntity';

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
    return this.http.post(this.userUrl, newUser, httpOptions);
  }

  public updateUser(user: UserEntity) {
    const updateUser = JSON.stringify(user);
    return this.http.put(this.userUrl, updateUser, httpOptions);
  }

  public deleteUser(userId) {
    let requestUrl: string = this.userUrl + "/" + userId;
    return this.http.delete(this.userUrl, httpOptions);
  }
}

