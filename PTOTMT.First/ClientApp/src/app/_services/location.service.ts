import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocationFromDBEntity } from '../_entities/LocationFromDBEntity';


const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  locationUrl: string;

  constructor(private http: HttpClient) {
    this.locationUrl = "https://localhost:44382/api/locations";
    }

  public getLocationById(locationId: string) {
    let requestUrl: string = this.locationUrl + "/" + locationId;
    return this.http.get<any>(requestUrl, httpOptions);
  }

  public getStatuses(): Observable<LocationFromDBEntity[]>{
    return this.http.get<LocationFromDBEntity[]>(this.locationUrl, httpOptions);
  }
} 
