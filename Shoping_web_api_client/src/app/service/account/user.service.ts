import { Injectable } from '@angular/core';
import {  HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from './base.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { CartService } from '../product.service';
import { Product } from 'src/app/model/product.model';
//import * as _ from 'lodash';
// Add the RxJS Observable operators we need in this app.
@Injectable()
export class UserService extends BaseService  {
  baseUrl: string = '';
  // Observable navItem source
  private _authNavStatusSource = new BehaviorSubject<boolean>(false);
  // Observable navItem stream
  authNavStatus$ = this._authNavStatusSource.asObservable();
  private loggedIn = false;
  constructor(public http: HttpClient,public router: Router,private cartService: CartService) {
    super();
    this.loggedIn = !!localStorage.getItem('auth_token');
    // ?? not sure if this the best way to broadcast the status but seems to resolve issue on page refresh where auth status is lost in
    // header component resulting in authed user nav links disappearing despite the fact user is still logged in
    this._authNavStatusSource.next(this.loggedIn);
  }
  login(userName, password): boolean {
    let check = false;
    this.http.post(
      environment.URL_API + 'auth/login',
      JSON.stringify({ userName, password }),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).subscribe(
      (res: any) => {
        // if(res.quyen=='Customer'){
        localStorage.setItem('auth_token', res.auth_token);
        localStorage.setItem('idUser', res.id);
        Swal.fire("Đăng nhập thành công .", '', 'success');
        window.location.href = "/";
        this.loggedIn = true;
        check = true;
        this._authNavStatusSource.next(true);
        // }
        // Cập nhật giỏ hàng sau khi đăng nhập
        const clicks = localStorage.getItem('idUser');
        if (clicks) {
          this.http.post(environment.URL_API + "Carts/getCart/" + clicks, {}).subscribe(
            (cartItems: Product[]) => { 
              localStorage.setItem('products', JSON.stringify(cartItems));
              this.cartService.itemsSubject.next(cartItems);  // Cập nhật giỏ hàng cho các components
            },
            (error) => {
              console.error("Error loading cart: ", error);
            }
          );
        }
      },
      (error) => {
        Swal.fire({
          title: 'Đăng nhập không thành công',
          text: "",
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Đóng',
        }).then((result) => { });
      }
    );
    return check;
  }
  
  

  // async login(userName: string, password: string): Promise<boolean> {
  //   try {
  //     const res: any = await this.http
  //       .post(
  //         environment.URL_API + 'auth/login',
  //         JSON.stringify({ userName, password }),
  //         { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
  //       )
  //       .toPromise();
  
  //     localStorage.setItem('auth_token', res.auth_token);
  //     localStorage.setItem('idUser', res.id);
  
  //     Swal.fire("Đăng nhập thành công.", '', 'success');
  
  //     window.location.href = "/";
  
  //     this.loggedIn = true;
  //     this._authNavStatusSource.next(true);
  
  //     const clicks = localStorage.getItem('idUser');
  //     const cart = await this.http
  //       .post(environment.URL_API + "Carts/getCart/" + clicks, {})
  //       .toPromise();
  //     localStorage.setItem('products', JSON.stringify(cart));
  //     return true;
  //   } catch (error) {
  //     Swal.fire({
  //       title: 'Đăng nhập không thành công',
  //       text: '',
  //       icon: 'error',
  //       confirmButtonColor: '#3085d6',
  //       confirmButtonText: 'Đóng',
  //     });
  
  //     return false;
  //   }
  // }
  

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
    this.loggedIn = false;
    this._authNavStatusSource.next(false);
  }
  isLoggedIn() {
    return this.loggedIn;
  }
  checkLogin():boolean
  {
    if (localStorage.getItem("idUser") != null||localStorage.getItem("auth_token") != null) {
      return true;
    }
    else {
      this.router.navigate(['/login']);
      return false
    }
  }
}

export interface UserRegistration {
  email: string;
  password: string;
  firstName: string;
  lastName:  string;
  location: string;
}
