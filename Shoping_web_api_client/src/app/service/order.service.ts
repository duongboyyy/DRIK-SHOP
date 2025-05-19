import { Injectable, Injector, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http' 
import { Observable } from 'rxjs'; 
import { BaseDefaultService } from './base-default.service';
import { environment } from 'src/environments/environment';
import { ResponseResult } from '../modules/response-result';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseDefaultService { 
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.URL_API1}/HoaDons`);
  }
   
//   Gets(key: string, offset?: number, limit?: number, sortField?: string) {
//     const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}`;
//     return this.defaultGet(queryString);
//   }
 
//   Save(id:number,d: FormData): Observable<any> {
//     return this._http.put<any>(`${environment.URL_API1}/HoaDons/suatrangthai/${id}`, d)
//   } 
Save(item: any): Promise<ResponseResult> {
    return this._http
      .post<ResponseResult>(this.serviceUri, item)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

}
