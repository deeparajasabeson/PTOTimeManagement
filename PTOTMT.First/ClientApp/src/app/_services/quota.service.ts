import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuotaEntity } from '../_entities/QuotaEntity';
import { FindQuotaEntity } from '../_entities/FindQuotaEntity';


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

  public getQuotasByTeamId(teamId: string) : Promise<any>{
    let requestUrl: string = this.quotaUrl + "/quotasbyteamid/" + teamId;
    return this.http.get(requestUrl, httpOptions).toPromise();
    }

  public saveQuota(quota: QuotaEntity) {
    const quotaData = JSON.stringify(quota);
    let response = this.http.post(this.quotaUrl, quotaData, httpOptions).toPromise();
    debugger;
      response.then((data: QuotaEntity) => {
        return data;
    })
  }

  public deleteQuota(quotaId: string) {
    let requestUrl: string = this.quotaUrl + "/quotabyid/" + quotaId;
    this.http.delete(requestUrl, httpOptions).subscribe(data => { return data });
  }

  public findQuota(entity: FindQuotaEntity) : Promise<any>{
    let requestUrl: string = this.quotaUrl + "/findQuota"
    return this.http.post(requestUrl, entity, httpOptions).toPromise();
  }
} 

