import { Injectable, Injector, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http' 
import { Observable } from 'rxjs'; 
import { BaseDefaultService } from '../admin/services/base-default.service';
import { environment } from '../../environments/environment';
import { ResponseResult } from '../admin/modules/response-result';
@Injectable({
  providedIn: 'root'
})
export class WarehouseProductService extends BaseDefaultService { 
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.URL_API1}/WarehouseProducts`);
  }
   
  Gets(key: string, offset?: number, limit?: number, sortField?: string) {
    const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}`;
    return this.defaultGet(queryString);
  }
 

  syncProduct(idSanPhamBienThe: number) {
    const url = `${this.serviceUri}/Sync`;
    return this._http.put<ResponseResult>(url, { idSanPhamBienThe }).toPromise();
  }
  

//   Save(d: any): Observable<any> {
//     return this._http.put<any>(`${environment.URL_API1}/TaoPhieuNhaps`, d)
//   } 
//   GetNCC(){
//     return this._http.get(`${environment.URL_API1}/NhaCungCap`);
//   }

  

}
