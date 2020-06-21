import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FlexTypeFromDBEntity } from '../_entities/FlexTypeFromDBEntity';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: 'root'
})
export class FlexTypeService {
  // The url of your login route on the server
  flexTypeUrl: string;

  constructor(private http: HttpClient) {
    this.flexTypeUrl = "https://localhost:44382/api/flextypes";
    }

  public  getFlexTypes(): Promise<FlexTypeFromDBEntity[]> {
    return this.http.get<FlexTypeFromDBEntity[]>(this.flexTypeUrl, httpOptions).toPromise();
  }

  public getFlexTypeByName(name: string): Observable<FlexTypeFromDBEntity> {
    let flexUrl: string = this.flexTypeUrl + "/flextypebyname/" + name;
    return this.http.get<FlexTypeFromDBEntity>(flexUrl, httpOptions);
  }

  public getFlexTypeById(flexTypeId): string {
    let flexTypeName: string = "";
    let flexUrl: string = this.flexTypeUrl + "/" + flexTypeId;
    let response = this.http.get<FlexTypeFromDBEntity>(flexUrl, httpOptions).toPromise();
    response.then((data: FlexTypeFromDBEntity) => {
      flexTypeName = data.name;
    });
    return flexTypeName;
  }
} 

