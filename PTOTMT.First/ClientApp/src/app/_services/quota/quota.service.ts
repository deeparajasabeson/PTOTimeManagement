import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { QuotaEntity } from '../../_entities/QuotaEntity';


@Injectable({
  providedIn: 'root'
})
export class QuotaService {
  // The url of your login route on the server
  quotaUrl: string;

  constructor(private http: HttpClient) {
    this.quotaUrl = "https://localhost:44382/api/quotas";
  }

  public saveQuota(quota: QuotaEntity) {
    const quotaData = JSON.stringify(quota);
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    //let response =
    let response = this.http.post(this.quotaUrl, quotaData, httpOptions)
      .subscribe((data: QuotaEntity) => {
        console.log("Response returned from create new quota response :")
        console.log(data);
        return data;
    })
  }
} 

