import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  // The url of your login route on the server
  teamUrl: string;

  constructor(private http: HttpClient) {
    this.teamUrl = "https://localhost:44382/api/teams";
  }

  public getTeamById(teamId: string) {
    let requestUrl: string = this.teamUrl + "/" + teamId;
    return this.http.get<any>(requestUrl, httpOptions);
  }
}

