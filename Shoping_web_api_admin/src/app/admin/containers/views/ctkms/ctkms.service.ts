import { Injectable, Injector } from '@angular/core';
import { BaseDefaultService } from '../../../services/base-default.service';
import { Observable } from 'rxjs';
import { ResponseResult } from '../../../modules/response-result';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CtkmsService extends BaseDefaultService {

  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.URL_API1}/CTKMs`);
}
   
  getAllCTKMs(key: string, offset?: number, limit?: number, sortField?: string) {
    const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}`;
    return this.defaultGet(queryString);
  }

  Save(ctkms: any): Observable<any> {
    return this._http.post<any>(`${environment.URL_API1}/CTKMs`, ctkms)
  }

  UpdateState(Id: number) {
    return this._http
       .post<ResponseResult>(`${this.serviceUri}/UpdateState?id=${Id}`, Id)
       .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
 }

 
 GetCTKMById(id: number) {
  const url = `${this.serviceUri}/GetCTKMById/${id}`;
  return this.defaultGet(url); 
}
GetTenCTKM():Observable<any>{
  return this._http.get(environment.URL_API+"CTKMs/TenChuongTrinh")
}
getSPByIdCTKM(id:number,key: string, offset?: number, limit?: number, sortField?: string) {
  const queryString = `${this.serviceUri}/GetSanPhamByIdCTKM?id=${id}&key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}`;
  return this.defaultGet(queryString);
}
GetProductsAvailableForCTKM(idLoai:number,idCTKM:number) {
  const queryString = `${this.serviceUri}/GetProductsAvailableForCTKM?idLoai=${idLoai}&idCTKM=${idCTKM}`;
  return this.defaultGet(queryString);
}
GetAutoCompleteProduct(idCTKM:number,key: string, offset?: number, limit?: number) {
  const queryString = `${this.serviceUri}/GetAutoCompleteProduct?idCTKM=${idCTKM}&key=${key}&offset=${offset}&limit=${limit}`;
  return this.defaultGet(queryString);
}
xoaSanPhamCTKM(idCTKM: number, idSP: number): Observable<any> {
  const params = new HttpParams()
    .set('idCTKM', idCTKM.toString())
    .set('idSP', idSP.toString());

  return this._http.post(`${environment.URL_API1}/CTKMs/XoaCTKMSP`, null, { params });
}
ThemSanPhamCTKM(idCTKM: number, idSP: number): Observable<any> {
  const params = new HttpParams()
    .set('idCTKM', idCTKM.toString())
    .set('idSP', idSP.toString());

  return this._http.post(`${environment.URL_API1}/CTKMs/ThemCTKMSP`, null, { params });
}

}
