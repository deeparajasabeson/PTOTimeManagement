import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { QuotaEntity } from '../../_entities/QuotaEntity';


@Injectable({
  providedIn: 'root'
})
export class QuotaService {
  // The url of your login route on the server
  quotaUrl: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.quotaUrl = baseUrl + "api/quotas/";
  }

  public saveQuota(quota: QuotaEntity) {
    const quotaData = JSON.stringify(quota);
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    console.log("going to call api in quotas service" + this.quotaUrl);
    let response = this.http.post(this.quotaUrl, quotaData, httpOptions);
    debugger;
    return response;
  }
} 

