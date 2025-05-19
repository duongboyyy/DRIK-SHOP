import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from './base.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { ToastServiceService } from '../../shared/toast-service.service';
import { environment } from '../../../../../environments/environment';
//import * as _ from 'lodash';
// Add the RxJS Observable operators we need in this app.
@Injectable()
export class UserService extends BaseService {
  baseUrl: string = '';
  // Observable navItem source
  private _authNavStatusSource = new BehaviorSubject<boolean>(false);
  // Observable navItem stream
  authNavStatus$ = this._authNavStatusSource.asObservable();
  private loggedIn = false;
  constructor(public toast: ToastServiceService, private http: HttpClient, public router: Router) {
    super();
    this.loggedIn = !!localStorage.getItem('auth_token');
    // ?? not sure if this the best way to broadcast the status but seems to resolve issue on page refresh where auth status is lost in
    // header component resulting in authed user nav links disappearing despite the fact user is still logged in
    this._authNavStatusSource.next(this.loggedIn);
    this.baseUrl = environment.URL_API
  }
  async login(userName: string, password: string): Promise<boolean> {
    try {
      const res: any = await this.http.post(
        `${this.baseUrl}auth/login`,
        JSON.stringify({ userName, password }),
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }).toPromise();

      this.handleSuccessfulLogin(res);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      this.toast.showToastDangNhapThatBai();
      return false;
    }
  }

  private handleSuccessfulLogin(res: any): void {    
    if (res.quyen != 'Customer'&& res.quyen!=null) {
      localStorage.setItem('auth_token', res.auth_token);
      localStorage.setItem('idUser', res.id);
      localStorage.setItem('fullname', res.fullname);
      localStorage.setItem('id_cuahang', res.id_cuahang.toString());
      //localStorage.setItem('quyen', res.quyen);
      localStorage.setItem('quyen', JSON.stringify(res.roles.map((role: any) => role.RoleName)));

      // Kiểm tra nếu người dùng có vai trò "Admin"
      const isAdmin = res.roles.some((role: any) => role.RoleName === 'Admin');
      //const isWareHouse = res.roles.some((role: any) => role.RoleName === 'WareHouse');

      if (isAdmin) {
          this.router.navigate(['/admin/dashboard']);
      } else {
          this.router.navigate(['/admin/products']);
      }

      this.toast.showToastDangNhapThanhCong();
      this.loggedIn = true;
      this._authNavStatusSource.next(true);
      
      
    }
    else{
      this.toast.showToastDangNhapThatBai();
    }
    
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
    this.loggedIn = false;
    this._authNavStatusSource.next(false);
  }
  isLoggedIn() {
    return this.loggedIn;
  }
}
export interface UserRegistration {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  location: string;
}