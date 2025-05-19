import { Injectable, Injector, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
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
export class RoleService extends BaseDefaultService { 
    constructor(http: HttpClient, injector: Injector) {
      super(http, injector, `${environment.URL_API1}/Role`);
  }
  getAllRoles(key: string, offset?: number, limit?: number, sortField?: string) {
    const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}`;
    return this.defaultGet(queryString);
  }
  // Save(d: any): Observable<any> {
  //   return this._http.post<any>(`${environment.URL_API1}/Role`, d)
  // } 
  Save(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post(`${environment.URL_API1}/Role`, JSON.stringify(data), { headers });
  }
  getRoleClaims(roleId: string): Promise<any> {
    return this._http.get(`${environment.URL_API1}/Role/GetRoleClaims/${roleId}`).toPromise();
  }
  removeRoleClaim(roleId: string, claimId: number): Observable<any> {
    return this._http.delete(`${environment.URL_API1}/Role/RemoveRoleClaim/${roleId}?claimId=${claimId}`);
}
AddRoleClaim(roleId: string, claimDto: { type: string; value: string; }): Observable<any> {
  return this._http.post(`${environment.URL_API1}/Role/AddRoleClaim?roleId=${roleId}`, claimDto);
}
}