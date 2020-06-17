import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuotaEntity } from '../_entities/QuotaEntity';
import { ToastrService } from 'ngx-toastr';


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

  constructor(private http: HttpClient,
                      public toasterService: ToastrService) {
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
   return this.http.post(this.quotaUrl, quotaData, httpOptions);
  }

  public deleteQuota(quotaId: string) {
    let requestUrl: string = this.quotaUrl + "/quotabyid/" + quotaId;
    let response = this.http.delete(requestUrl, httpOptions);
    response.subscribe(data => { return data });
  }
} 

