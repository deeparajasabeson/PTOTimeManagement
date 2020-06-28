import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PTOEntity } from '../_entities/PTOEntity';
import { PTOFromDBEntity } from '../_entities/PTOFromDBEntity';


const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: 'root'
})
export class PTOService {
 ptoUrl: string;

  constructor(private http: HttpClient) {
    this.ptoUrl = "https://localhost:44382/api/requests";
  }

  public getPTOById(ptoId: string): Observable<PTOFromDBEntity> {
    let requestUrl: string = this.ptoUrl + "/" + ptoId;
    return this.http.get<PTOFromDBEntity>(requestUrl, httpOptions);
  }

  public getPTOsByUserId(userId: string): Promise<PTOFromDBEntity[]> {
    let requestUrl: string = this.ptoUrl + "/ptorequestsbyuserid/" + userId;
    return this.http.get<PTOFromDBEntity[]>(requestUrl, httpOptions).toPromise();
  }

  public getRequestsReportingMembers( leadershipUserId: string,
                                                                fromDate: Date,
                                                                toDate: Date): Promise<PTOFromDBEntity[]> {
    let requestUrl: string = this.ptoUrl +
      "/requestsreportingmembers" +
      "?leadershipUserId=" + leadershipUserId +
      "&fromDate=" + fromDate.toUTCString() +
      "&toDate=" + toDate.toUTCString();
    return this.http.get<PTOFromDBEntity[]>(requestUrl, httpOptions).toPromise();
  }

  public getPTOsByUserIdInDateRange(userId: string,
                                                              fromDate: Date,
    toDate: Date): Promise<PTOFromDBEntity[]> {
    let requestUrl: string = this.ptoUrl +
      "/ptorequestsbyuseridindaterange" +
      "?userId=" + userId +
      "&fromDate=" + fromDate.toUTCString() +
      "&toDate=" + toDate.toUTCString();
    return this.http.get<PTOFromDBEntity[]>(requestUrl, httpOptions).toPromise();
  }

  public savePTO(pto: PTOEntity) {
    const ptoData = JSON.stringify(pto);
    this.http.post(this.ptoUrl, ptoData, httpOptions).toPromise()
      .then((data: PTOEntity) => {
        return data;
      })
  }

  public deletePTO(ptoId: string) {
    let requestUrl: string = this.ptoUrl + "/ptobyid/" + ptoId;
    this.http.delete(requestUrl, httpOptions).subscribe(data => { return data });
  }

  public approvePTO(ptoId: string) {
    let requestUrl: string = this.ptoUrl + "/approvepto/" + ptoId;
    this.http.get(requestUrl, httpOptions).subscribe(data => { return data });
  }

  public declinePTO(ptoId: string) {
    let requestUrl: string = this.ptoUrl + "/declinepto/" + ptoId;
    this.http.get(requestUrl, httpOptions).subscribe(data => { return data });
  }
}
