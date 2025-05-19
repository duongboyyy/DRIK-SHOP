import { Injectable, Injector, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http' 
import { Observable } from 'rxjs'; 
import { BaseDefaultService } from '../admin/services/base-default.service';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class WarehouseService extends BaseDefaultService { 
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.URL_API1}/Warehouses`);
  }
   
  Gets(key: string, offset?: number, limit?: number, sortField?: string) {
    const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}`;
    return this.defaultGet(queryString);
  }
 
//   Save(d: any): Observable<any> {
//     return this._http.put<any>(`${environment.URL_API1}/TaoPhieuNhaps`, d)
//   } 
//   GetNCC(){
//     return this._http.get(`${environment.URL_API1}/NhaCungCap`);
//   }

  

}
