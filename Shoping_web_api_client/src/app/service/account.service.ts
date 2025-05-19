import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ResponseResult } from '../modules/response-result';
import { BaseDefaultService } from './base-default.service';

@Injectable()
export class AccountsService extends BaseDefaultService {

 baseUrl: string = '';
  // Observable navItem source
  private _authNavStatusSource = new BehaviorSubject<boolean>(false);
  // Observable navItem stream
  authNavStatus$ = this._authNavStatusSource.asObservable();
  private loggedIn = false;

  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.URL_API1}/Accounts`);
  }

  /**
   * Đăng nhập bằng Google
   * @param tokenId - Google ID token
   * @returns Observable<ResponseResult<any>>
   */
//   loginWithGoogle(tokenId: string): Observable<ResponseResult<any>> {
//     const url = `${this.serviceUri}/login-google`; // API URL
//     return this._http.post<ResponseResult<any>>(url, tokenId).pipe(
//       catchError(this.handleError) // Xử lý lỗi nếu cần
//     );
//   }

// loginWithGoogle(tokenId: string): Promise<ResponseResult> {
//     const url = `${this.serviceUri}/login-google`;
//     return this._http
//       .post<ResponseResult>(url, tokenId)
//       .pipe(catchError(err => this.handleError(err,this._injector)))
//       .toPromise();
//   }

  loginWithGoogle(tokenId: string): Promise<ResponseResult> {
    const url = `${this.serviceUri}/login-google`;
    // const url = `${environment.URL_API}Auth/login-google`;
    
    const payload = { tokenId: tokenId }; // Đóng gói tokenId thành object
    return this._http
      .post<ResponseResult>(url, payload, { headers: { 'Content-Type': 'application/json' } })
      .pipe(catchError(err => this.handleError(err, this._injector)))
      .toPromise();
  }
  
  
}
