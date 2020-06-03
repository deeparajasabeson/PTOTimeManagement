import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { QuotaEntity } from '../../_entities/QuotaEntity';
import { Observable } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: 'root'
})
export class QuotaService {
  // The url of your login route on the server
  quotaUrl: string;

  constructor(private http: HttpClient) {
    this.quotaUrl = "https://localhost:44382/api/quotas";
    }

  public getQuotaById(quotaId: string) {
    let requestUrl: string = this.quotaUrl + "/" + quotaId;
    return this.http.get<any>(requestUrl, httpOptions);
  }

  public getQuotasByTeamId(teamId: string) : Observable<any>{
    let requestUrl: string = this.quotaUrl + "/quotasbyteamid/" + teamId;
    return this.http.get(requestUrl, httpOptions);
    }

  public saveQuota(quota: QuotaEntity) {
    const quotaData = JSON.stringify(quota);
    this.http.post(this.quotaUrl, quotaData, httpOptions)
      .subscribe((data: QuotaEntity) => {
        return data;
    })
  }
} 

