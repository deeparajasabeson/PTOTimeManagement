import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RoleFromDBEntity } from '../_entities/RoleFromDBEntity';


const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  roleUrl: string;

  constructor(private http: HttpClient) {
    this.roleUrl = "https://localhost:44382/api/roles";
    }

  public getRoleById(roleId: string) {
    let requestUrl: string = this.roleUrl + "/" + roleId;
    return this.http.get<any>(requestUrl, httpOptions);
  }

  public getRoles(): Observable<RoleFromDBEntity[]>{
    return this.http.get<RoleFromDBEntity[]>(this.roleUrl, httpOptions);
  }
} 
