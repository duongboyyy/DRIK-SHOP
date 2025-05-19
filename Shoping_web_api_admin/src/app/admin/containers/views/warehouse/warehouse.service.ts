import { Injectable, Injector } from '@angular/core';
import { BaseDefaultService } from '../../../services/base-default.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ResponseResult } from '../../../modules/response-result';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService extends BaseDefaultService {

  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.URL_API1}/Warehouses`);
}
   
  getAllWarehouses(key: string, offset?: number, limit?: number, sortField?: string) {
    const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}`;
    return this.defaultGet(queryString);
  }

  Save(warehouses: any): Observable<any> {
    return this._http.post<any>(`${environment.URL_API1}/Warehouses`, warehouses)
  }

  UpdateState(Id: number) {
    return this._http
       .post<ResponseResult>(`${this.serviceUri}/UpdateState?id=${Id}`, Id)
       .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
 }

 
 GetWareHouseById(id: number) {
  const url = `${this.serviceUri}/GetWareHouseById/${id}`;
  return this.defaultGet(url); 
}

}
