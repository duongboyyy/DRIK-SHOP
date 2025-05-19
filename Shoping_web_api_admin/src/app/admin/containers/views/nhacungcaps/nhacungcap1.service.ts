import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http' 
import { environment } from '../../../../../environments/environment'; 
import { BaseDefaultService } from '../../../services/base-default.service' 
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NhaCungCap1Service extends BaseDefaultService { 

  constructor(
    http: HttpClient,
     injector: Injector) 
    {
    super(http, injector, `${environment.URL_API1}/NhaCungCaps`);
    }
   
  Gets(key: string, offset?: number, limit?: number, sortField?: string) {
    const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}`;
    return this.defaultGet(queryString);
  }

  Save(sup: any): Observable<any> {
    return this._http.post<any>(`${environment.URL_API1}/NhaCungCaps`, sup)
  }

  GetShort() {
    const queryString = `${this.serviceUri}/GetShort`;
    return this.defaultGet(queryString);
  }
 
}
