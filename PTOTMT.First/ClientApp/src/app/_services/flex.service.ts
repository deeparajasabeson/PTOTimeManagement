import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FlexEntity } from '../_entities/FlexEntity';
import { FlexFromDBEntity } from '../_entities/FlexFromDBEntity';


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

  public getFlexById(flexId: string): Observable<FlexFromDBEntity> {
    let requestUrl: string = this.flexUrl + "/" + flexId;
    return this.http.get<FlexFromDBEntity>(requestUrl, httpOptions);
  }

  public getFlexsByUserId(userId: string): Promise<FlexFromDBEntity[]> {
    let requestUrl: string = this.flexUrl + "/flexsbyuserid/" + userId;
    return this.http.get<FlexFromDBEntity[]>(requestUrl, httpOptions).toPromise();
  }

  public getFlexsReportingMembers(leadershipUserId: string,
                                                        fromDate: Date,
                                                        toDate: Date): Promise<FlexFromDBEntity[]> {
    let requestUrl: string = this.flexUrl +
      "/flexsreportingmembers" +
      "?leadershipUserId=" + leadershipUserId +
      "&fromDate=" + fromDate.toUTCString() +
      "&toDate=" + toDate.toUTCString();
    return this.http.get<FlexFromDBEntity[]>(requestUrl, httpOptions).toPromise();
  }

  public getFlexsByUserIdInDateRange( userId: string,
                                                              fromDate: Date,
                                                              toDate: Date): Promise<FlexFromDBEntity[]> {
    let requestUrl: string = this.flexUrl +
      "/flexsbyuseridindaterange" +
      "?userId=" + userId +
      "&fromDate=" + fromDate.toUTCString() +
      "&toDate=" + toDate.toUTCString();
    return this.http.get<FlexFromDBEntity[]>(requestUrl, httpOptions).toPromise();
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

  public approveFlex(flexId: string) {
    let requestUrl: string = this.flexUrl + "/approveflex/" + flexId;
    this.http.get(requestUrl, httpOptions).subscribe(data => { return data });
  }

  public declineFlex(flexId: string) {
    let requestUrl: string = this.flexUrl + "/declineflex/" + flexId;
    this.http.get(requestUrl, httpOptions).subscribe(data => { return data });
  }
}
