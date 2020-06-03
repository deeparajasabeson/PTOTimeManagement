import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PTOEntity } from '../../_entities/PTOEntity';
import { Observable } from 'rxjs';


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

  public getPTOById(ptoId: string) {
    let requestUrl: string = this.ptoUrl + "/" + ptoId;
    return this.http.get<any>(requestUrl, httpOptions);
  }

  public getPTOsByUserId(userId: string): Observable<any> {
    let requestUrl: string = this.ptoUrl + "/ptorequestsbyuserid/" + userId;
    return this.http.get(requestUrl, httpOptions);
  }

  public savePTO(pto: PTOEntity) {
    const ptoData = JSON.stringify(pto);
    this.http.post(this.ptoUrl, ptoData, httpOptions)
      .subscribe((data: PTOEntity) => {
        return data;
      })
  }
}
