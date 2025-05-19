import { Injectable, Injector, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { BaseService } from '../account/base.service';
import { BaseDefaultService } from '../../../services/base-default.service';
import { ResponseResult } from '../../../modules/response-result';
import { catchError, retry } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class Product1Service extends BaseDefaultService { 
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.URL_API1}/SanPhams`);
}
   
  getAllProducts1(key: string, offset?: number, limit?: number, sortField?: string) {
    const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}`;
    return this.defaultGet(queryString);
  }

  Save(product: any): Observable<any> {
    return this._http.post<any>(`${environment.URL_API1}/SanPhams`, product)
  }

  UpdateState(Id: number) {
    return this._http
       .post<ResponseResult>(`${this.serviceUri}/UpdateState?id=${Id}`, Id)
       .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
 }

 
 GetProductById(id: number) {
  const url = `${this.serviceUri}/GetProductById/${id}`;
  return this.defaultGet(url); 
}
GetCTKMByIdProduct(id: number) {
  const url = `${this.serviceUri}/CTKM/${id}`;
  return this.defaultGet(url); 
}

GetAutoCompleteProduct(key: string, offset?: number, limit?: number) {
  const queryString = `${this.serviceUri}/GetAutoCompleteProduct?key=${key}&offset=${offset}&limit=${limit}`;
  return this.defaultGet(queryString);
}

  // GetSanPham(id?:number) {
  //   const queryString = `${this.serviceUri}/${id}`;
  //   return this.
  // }
 
}
