import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { QuotaEntity } from '../../_entities/QuotaEntity';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class QuotaService {
  // The url of your login route on the server
  quotaUrl: string;

  constructor(private http: HttpClient) {
    this.quotaUrl = "https://localhost:44382/api/quotas";
  }

  public getQuotasByTeamId(teamId: string) : Observable<any>{
    let quotaList;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    let requestUrl: string = this.quotaUrl + "/quotasbyteamid/" + teamId;
    return this.http.get(requestUrl, httpOptions);
    }

  public saveQuota(quota: QuotaEntity) {
    const quotaData = JSON.stringify(quota);
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    this.http.post(this.quotaUrl, quotaData, httpOptions)
      .subscribe((data: QuotaEntity) => {
        console.log("Response returned from create new quota create :")
        console.log(data);
        return data;
    })
  }
} 

