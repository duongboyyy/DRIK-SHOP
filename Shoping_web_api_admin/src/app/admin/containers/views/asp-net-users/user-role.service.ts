import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { BaseDefaultService } from '../../../services/base-default.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserRoleService extends BaseDefaultService{
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.URL_API1}/Role`);
}
Gets(key: string, offset?: number, limit?: number, sortField?: string) {
  const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}`;
  return this.defaultGet(queryString);
}

// getUserRoles(userId: string) {
//   const queryString = `${this.serviceUri}/GetUserRole?userId=${userId}`;
//   return this.defaultGet(queryString);
// }

getUserRoles(userId: number): Promise<any> {
  return this._http.get<any>(`${this.serviceUri}/GetUserRole/${userId}`).toPromise();
}

Save(role: any): Observable<any> {
  return this._http.post<any>(`${this.serviceUri}/AssignUserRoles`, role);
}

}
