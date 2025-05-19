import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DvhcService {
  constructor(private http: HttpClient) {}

  getTinhThanh(): Observable<any> {
    const apiUrl = 'https://provinces.open-api.vn/api/?depth=3';
    return this.http.get<any>(apiUrl);
  }
}
