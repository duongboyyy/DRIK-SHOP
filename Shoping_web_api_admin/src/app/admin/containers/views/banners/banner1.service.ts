import { Injectable, Injector, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http' 
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs'; 
import { BaseDefaultService } from '../../../services/base-default.service'; 
@Injectable({
  providedIn: 'root'
})
export class Banner1Service extends BaseDefaultService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.URL_API1}/Banners`);
  }
   
  Gets(key: string, id?: number, offset?: number, limit?: number, sortField?: string) {
    const queryString = `${this.serviceUri}?key=${key}&idBanner=${id}&offset=${offset}&limit=${limit}&sortField=${sortField}`;
    return this.defaultGet(queryString);
  }

  // Gets(key: string = '', offset: number = 0, limit: number = 20, sortField: string = '', sortOrder: string = 'asc'): Observable<any> {
  //   let params = new HttpParams()
  //     .set('key', key)
  //     .set('offset', offset.toString())
  //     .set('limit', limit.toString())
  //     .set('sortField', sortField)
  //     .set('sortOrder', sortOrder);

  //   return this._http.get(this.apiUrl, { params });
  // }
 
  Save(d: any): Observable<any> {
    return this._http.post<any>(`${environment.URL_API1}/Banners`, d)
  } 
  
  GetDetail(id: number) {
    const url = `${this.serviceUri}/${id}`;
    return this.defaultGet(url); 
  }
}
