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
import { retry } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class Brand1Service extends BaseDefaultService { 
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.URL_API1}/NhanHieus`);
}
   
  Gets(key: string, offset?: number, limit?: number, sortField?: string) {
    const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}`;
    return this.defaultGet(queryString);
  }

  Save(bra: any): Observable<any> {
    return this._http.post<any>(`${environment.URL_API1}/NhanHieus`, bra)
  }
  
}
