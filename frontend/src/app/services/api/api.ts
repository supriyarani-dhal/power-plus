import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private BASE_URL = 'http://localhost:5000/api'; // backend container port

  constructor(private http: HttpClient) {}

  getSensorsSummary(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/sensors/summary`);
  }

  getRegionSensors(regionId: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/sensors/region/${regionId}`);
  }

  getAlerts(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/alerts`);
  }
}
