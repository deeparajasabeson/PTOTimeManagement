import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';


@Injectable({
  providedIn: 'root'  
})
export class AuthService {
  // The url of your login route on the server
  loginUrl: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.loginUrl = baseUrl + "api/auth/login";
  }

  public login(loginForm: NgForm) {
    const credentials = JSON.stringify(loginForm.value);
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.post(this.loginUrl, credentials, httpOptions);
  }

  public getAuthorizationToken(): string {
    return localStorage.getItem("jwt");
  }
} 
