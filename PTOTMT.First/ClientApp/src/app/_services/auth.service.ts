import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { DataSharingService } from './datasharing.service';
import { Observable } from 'rxjs';
import { UserFromDBEntity } from '../_entities/UserFromDBEntity';

@Injectable({
  providedIn: 'root'  
})
export class AuthService {
  // The url of your login route on the server
  loginUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private dataSharingService: DataSharingService
  ) {
    this.loginUrl = "https://localhost:44382/api/users/login";
    //this.loginUrl = baseUrl + "api/users/login";
  }

  public login(loginForm: NgForm) :Observable<UserFromDBEntity>{
    const credentials = JSON.stringify(loginForm.value);
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.post<UserFromDBEntity>(this.loginUrl, credentials, httpOptions);
  }

  public isUserAuthenticated(): boolean {
    let token: string = localStorage.getItem("jwt");
    return (token && !this.jwtHelper.isTokenExpired(token)) ? true : false;
  }

  public getAuthorizationToken(): string {
    return localStorage.getItem("jwt");
  }

  public logOut() {
    localStorage.removeItem("jwt");
    this.dataSharingService.isUserAuthenticated.next(false);
    this.router.navigate(['/loggedout']);
  }
} 
