import { Injectable, Injector, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http' 
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs'; 
import { BaseDefaultService } from '../../../services/base-default.service'; 
import { ResponseResult } from '../../../modules/response-result';
@Injectable({
  providedIn: 'root'
})
export class TaoPhieuNhap1Service extends BaseDefaultService { 
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.URL_API1}/TaoPhieuNhaps`);
  }
   
  Gets(key: string, idNcc: number = -1, isPayment: number = -1, startDate?: Date, endDate?: Date, offset?: number, limit?: number, sortField?: string) {

    let fDate = startDate ? startDate.toISOString() : "";
    let tDate = endDate ? endDate.toISOString() : "";

    const queryString = `${this.serviceUri}?key=${key}&idNcc=${idNcc}&isPayment=${isPayment}&startDate=${fDate}&endDate=${tDate}&offset=${offset}&limit=${limit}&sortField=${sortField}`;
    return this.defaultGet(queryString);
  }
 
  Save(d: any): Observable<any> {
    return this._http.put<any>(`${environment.URL_API1}/TaoPhieuNhaps`, d)
  } 
  GetNCC(){
    return this._http.get(`${environment.URL_API1}/NhaCungCap`);
  }

  updateMultiCongNo(form: any): Promise<any> {
    return this._http
      .post<any>(`${environment.URL_API1}/TaoPhieuNhaps/UpdateMultiCongNo`, form)
      .toPromise();
  }

  UpdateCongNo(form: any[]): Promise<any> {
    return this._http
      .post<any>(`${environment.URL_API1}/TaoPhieuNhaps/UpdateCongNo`, form)
      .toPromise();
  }

}
