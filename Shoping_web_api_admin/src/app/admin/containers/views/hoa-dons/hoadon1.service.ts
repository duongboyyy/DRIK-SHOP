import { Injectable, Injector, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http' 
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs'; 
import { BaseDefaultService } from '../../../services/base-default.service'; 
@Injectable({
  providedIn: 'root'
})
export class HoaDon1Service extends BaseDefaultService { 
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.URL_API1}/HoaDons`);
  }
   
  Gets(key: string, id_cuahang: number = -1, isPayed: number = -1, loaiDon: number = -1, trangThai: number = -1, startDate?:Date , endDate?: Date, offset?: number, limit?: number, sortField?: string) {
    let fDate = startDate ? startDate.toISOString() : "";
    let tDate = endDate ? endDate.toISOString() : "";
    const queryString = `${this.serviceUri}?key=${key}&id_cuahang=${id_cuahang}&isPayed=${isPayed}&loaiDon=${loaiDon}&trangThai=${trangThai}&startDate=${fDate}&endDate=${tDate}&offset=${offset}&limit=${limit}&sortField=${sortField}`;
    return this.defaultGet(queryString);
  }
 
  Save(id:number,d: FormData): Observable<any> {
    return this._http.put<any>(`${environment.URL_API1}/HoaDons/suatrangthai/${id}`, d)
  }

}
