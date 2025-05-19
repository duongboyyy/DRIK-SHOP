import { HttpClient } from "@angular/common/http";
import { Injectable, Injector, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { environment } from "../../../../../environments/environment";
import { BaseDefaultService } from "../../../services/base-default.service";
import { Observable } from "rxjs";
@Injectable({
    providedIn: 'root'
  })
export class User1Service extends BaseDefaultService{
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.URL_API1}/UserManagers`);
}

Gets(key: string, offset?: number, limit?: number, sortField?: string) {
  const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}`;
  return this.defaultGet(queryString);
}
Save(d: any): Observable<any> {
    return this._http.post<any>(`${environment.URL_API1}/Accounts/AdminCreateUser`, d)
  }

  GetByUserId(userId: string) {
    const url = `${this.serviceUri}/GetByUserId/${userId}`;
    return this.defaultGet(url); 
  }
  
}
