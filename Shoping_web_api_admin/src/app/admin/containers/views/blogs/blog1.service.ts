import { Injectable, Injector, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http' 
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs'; 
import { BaseDefaultService } from '../../../services/base-default.service'; 
@Injectable({
  providedIn: 'root'
})
export class Blog1Service extends BaseDefaultService { 
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.URL_API1}/Blogs`);
  }
   
  Gets(key: string, offset?: number, limit?: number, sortField?: string) {
    const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}`;
    return this.defaultGet(queryString);
  }
 
  Save(d: any): Observable<any> {
    return this._http.post<any>(`${environment.URL_API1}/Blogs`, d)
  } 
  
  GetDetail(id: number) {
    const url = `${this.serviceUri}/${id}`;
    return this.defaultGet(url); 
  }

  GetBlogEdit(id: number) {
    const url = `${this.serviceUri}/GetBlogEdit/${id}`;
    return this.defaultGet(url); 
  }
  

}
