import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FlexEntity } from '../_entities/FlexEntity';


const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: 'root'
})
export class FlexService {
  flexUrl: string;

  constructor(private http: HttpClient) {
    this.flexUrl = "https://localhost:44382/api/flexs";
  }

  public getFlexById(flexId: string) {
    let requestUrl: string = this.flexUrl + "/" + flexId;
    return this.http.get<any>(requestUrl, httpOptions);
  }

  public getFlexsByUserId(userId: string): Promise<any> {
    let requestUrl: string = this.flexUrl + "/flexsbyuserid/" + userId;
    return this.http.get(requestUrl, httpOptions).toPromise();
  }

  public saveFlex(flex: FlexEntity) {
    const flexData = JSON.stringify(flex);
    this.http.post(this.flexUrl, flexData, httpOptions).toPromise()
      .then((data: FlexEntity) => {
        return data;
      })
  }

  public deleteFlex(flexId: string) {
    let requestUrl: string = this.flexUrl + "/flexbyid/" + flexId;
    this.http.delete(requestUrl, httpOptions).subscribe(data => { return data });
  }
}
